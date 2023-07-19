import Koa from "koa";
import { prisma } from "../server";
import { KoaRequestBody } from "@/types";

const RegisterUser = async (ctx: Koa.Context) => {
  try {
    const { username } = ctx.request.body as KoaRequestBody;
    console.log(username);
    // await prisma.user.create({
    //   data: {
    //     username,
    //   },
    // });
  } catch (err) {
    ctx.status = 409;
    ctx.body = { status: "rejected" };
  }
};

const authController = {
  RegisterUser,
};

export default authController;
