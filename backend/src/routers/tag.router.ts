import { Router } from "express";
import * as TagController from "../controllers/tag.controller";

const router = Router();

router.get("/seed", TagController.seedTags);

router.get("/", TagController.getTags);

router.post("/create", TagController.createTag);

router.delete("/delete/:tagId", TagController.deleteTag);

export default router;
