import { Router } from "express";
import { sample_tags } from "../data";
import asyncHandler from "express-async-handler";
import { TagModel } from "../models/tag.model";
import { AppError } from "../errors/app-error";

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
    const tags = await TagModel.find();
    const all = req.query.all === "true";

    if (tags.length === 0) {
      throw new AppError(404, "Tasks not found");
    }

    if (all) {
      res.send(tags);
    } else {
      const limit = 3;
      res.send(tags.slice(0, limit));
    }
  })
);

router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const newTag = new TagModel(req.body);

    if (!newTag.name || !newTag.emoji) {
      throw new AppError(400, "Name and emoji are required.");
    }

    const savedTag = await newTag.save();

    res.status(201).json({
      message: "New tag created.",
      tag: savedTag,
    });
  })
);

export default router;
