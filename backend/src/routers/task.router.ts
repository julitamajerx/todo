import { Router } from "express";
import * as TaskController from "../controllers/task.controller";

const router = Router();

router.get("/seed", TaskController.seedTasks);

router.get("/", TaskController.getTasks);

router.get("/:taskId", TaskController.getTaskById);

router.post("/create", TaskController.createTask);

router.patch("/delete/:taskId", TaskController.deleteTask);

router.patch("/complete/:taskId", TaskController.completeTask);

router.patch("/update/:taskId", TaskController.updateTask);

export default router;
