import Koa from "koa";
import bodyparser from "koa-bodyparser";
import cors from "@koa/cors";
import "dotenv/config";

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

import authRouter from "./routes/authApi";

const PORT = process.env.PORT || 3500;

async function main() {
  const app = new Koa();
  app.use(bodyparser());
  app.use(cors());
  app.use(authRouter.routes());

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
