import Koa from "koa";
import { prisma } from "../server";
import { KoaRequestBody } from "@/types";

import { 
  generateRegistrationOptions,
  verifyRegistrationResponse
} from "@simplewebauthn/server";
import type {
  GenerateRegistrationOptionsOpts,
  VerifyRegistrationResponseOpts,
} from "@simplewebauthn/server";
import type { RegistrationResponseJSON, AuthenticatorDevice } from "@simplewebauthn/typescript-types";

type Challenge = Record<string, string>;
const challenges: Challenge = {};

const RegisterUser = async (ctx: Koa.Context) => {
  try {
    const { username } = ctx.request.body as KoaRequestBody;
    const user = await prisma.user.create({
      data: {
        username,
      },
    });

    const opts: GenerateRegistrationOptionsOpts = {
      rpName: "Passkey Next.js Demo",
      rpID: "localhost",
      userID: user.id,
      userName: username,
      timeout: 60000,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "discouraged",
      },
      supportedAlgorithmIDs: [-7, -257],
    };

    const options = generateRegistrationOptions(opts);
    challenges[user.id] = options.challenge;
    ctx.status = 200;
    ctx.body = options;
  } catch (err) {
    ctx.status = 409;
    ctx.body = { status: err };
  }
};

const VerifyRegistration = async (ctx: Koa.Context) => {
  try {
    const body: RegistrationResponseJSON = ctx.request.body as RegistrationResponseJSON;
    const { userId } = body as any;
    const challenge = challenges[userId];
    
    const opts: VerifyRegistrationResponseOpts = {
      response: body as RegistrationResponseJSON,
      expectedChallenge: challenge,
      expectedOrigin: "http://localhost:5500",
      expectedRPID: "localhost",
      requireUserVerification: true,
    };
    
    const verification = await verifyRegistrationResponse(opts);
    const { verified, registrationInfo } = verification;
    
    if (verified && registrationInfo) {
      const { credentialPublicKey, credentialID, counter } = registrationInfo;
      
      await prisma.authenticator.create({
        data: {
          credentialPublicKey: Buffer.from(credentialPublicKey.buffer),
          credentialID: Buffer.from(credentialID.buffer),
          counter,
          transports: JSON.stringify(body.response.transports),
          UserId: userId
        }
      });

      delete challenges[userId];

      ctx.status = 200;
      ctx.body = { verified };
    }
  } catch (err) {
    ctx.status = 409;
    ctx.body = { status: err };
  }
};

const LoginUser = async (ctx: Koa.Context) => {
  try {
    const { username } = ctx.request.body as KoaRequestBody;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      ctx.status = 404;
      ctx.body = { status: "fail to find user" };
    } else {
      const authDevice = await prisma.authenticator.findFirst({ where: { UserId: user.id, } })
      console.log(authDevice);
    }
  } catch (err) {
    ctx.status = 409;
    ctx.body = { status: err };
  }
}

const authController = {
  RegisterUser,
  VerifyRegistration,
  LoginUser,
};

export default authController;
