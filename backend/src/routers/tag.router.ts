import { Router } from "express";
import { sample_tags } from "../data";
import asyncHandler from "express-async-handler";
import { TagModel } from "../models/tag.model";
import { TaskTagModel } from "../models/tasktag.model";

const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const tagCount = await TagModel.countDocuments();

    if (tagCount > 0) {
      res.send("Tag have been already seeded.");
      return;
    }

    await TagModel.create(sample_tags);
    res.send("Tag seed is done.");
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tasks = await TagModel.find();
    const all = req.query.all === "true";

    if (all) {
      res.send(tasks);
    } else {
      const limit = 3;
      res.send(tasks.slice(0, limit));
    }
  })
);

export default router;
