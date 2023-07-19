import Router from "koa-router";
import authController from "../controllers/authController";

const router = new Router();

router.post("/register/generate", authController.RegisterUser);
router.post("/register/verify", authController.VerifyRegistration);

export default router;
