import { Router } from "express";
import * as ListController from "../controllers/list.controller";

const router = Router();

router.get("/seed", ListController.seedList);

router.get("/", ListController.getLists);

router.post("/create", ListController.createList);

router.delete("/delete/:listId", ListController.deleteList);

export default router;
