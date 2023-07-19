import Router from "koa-router";
import authController from "../controllers/authController";

const router = new Router();

router.post("/register/generate", authController.RegisterUser);

export default router;
