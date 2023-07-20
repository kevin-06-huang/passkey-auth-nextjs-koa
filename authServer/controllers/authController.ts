import Koa from "koa";
import { prisma } from "../server";
import { KoaRequestBody } from "@/types";

import { 
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";

import type {
  GenerateRegistrationOptionsOpts,
  VerifyRegistrationResponseOpts,
  GenerateAuthenticationOptionsOpts,
  VerifyAuthenticationResponseOpts,
} from "@simplewebauthn/server";

import type { 
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorDevice,
} from "@simplewebauthn/typescript-types";

const challenges: Record<string, string> = {};
const devices: Record<string, AuthenticatorDevice> = {};
const users: Record<string, string> = {};

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
    const { userID } = body as any;
    const challenge = challenges[userID];

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
      console.log(typeof counter);
      
      await prisma.authenticator.create({
        data: {
          credentialPublicKey: Buffer.from(credentialPublicKey.buffer),
          credentialID: Buffer.from(credentialID.buffer),
          counter,
          transports: JSON.stringify(body.response.transports),
          UserId: userID
        }
      });

      delete challenges[userID];

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
      users[user.id] = user.username;

      const authDevice = await prisma.authenticator.findFirst({ where: { UserId: user.id, } });
      const credentialID = new Uint8Array(authDevice!.credentialID);
      const transports = JSON.parse(authDevice!.transports as string);
      
      devices[user.id] = authDevice as unknown as AuthenticatorDevice;

      const opts: GenerateAuthenticationOptionsOpts = {
        timeout: 60000,
        allowCredentials: [{
          id: credentialID,
          type: 'public-key',
          transports: transports,
        }],
        userVerification: 'required',
        rpID: "localhost",
      };

      const options = generateAuthenticationOptions(opts);
      challenges[user.id] = options.challenge;

      ctx.status = 200;
      ctx.body = options;
    }
  } catch (err) {
    ctx.status = 409;
    ctx.body = { status: err };
  }
};

const VerifyUser = async (ctx: Koa.Context) => {
  try {
    const body: AuthenticationResponseJSON = ctx.request.body as AuthenticationResponseJSON;
    const userID = body.response.userHandle;
    const challenge = challenges[userID!];
    const authDevice = devices[userID!]

    const opts: VerifyAuthenticationResponseOpts = {
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: "http://localhost:5500",
      expectedRPID: "localhost",
      authenticator: authDevice,
      requireUserVerification: true,
    };

    const verification = await verifyAuthenticationResponse(opts);
    const { verified, authenticationInfo } = verification;

    if (verified) {
      await prisma.authenticator.updateMany({
        where: { credentialID: Buffer.from(authDevice.credentialID)  },
        data: {
          counter: authenticationInfo.newCounter,
        },
      });

      const user = { username: users[userID!] };

      delete challenges[userID!];
      delete devices[userID!];
      delete users[userID!];

      ctx.status = 200;
      ctx.body = { verified, user };
    }
  } catch (err) {
    ctx.status = 409;
    ctx.body = { status: err };
  }
};

const authController = {
  RegisterUser,
  VerifyRegistration,
  LoginUser,
  VerifyUser,
};

export default authController;
