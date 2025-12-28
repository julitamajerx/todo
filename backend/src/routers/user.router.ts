import { Router } from "express";
import * as UserController from "../controllers/user.controller";

const router = Router();

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

export default router;
