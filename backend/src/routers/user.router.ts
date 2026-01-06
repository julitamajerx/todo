import { Router } from "express";
import * as UserController from "../controllers/user.controller";
import { upload } from "../middlewares/uploadHandler";

const router = Router();

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.post("/register", upload.single("avatar"), UserController.register);

export default router;
