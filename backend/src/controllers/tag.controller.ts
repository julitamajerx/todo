import { sample_tags } from "../data";
import asyncHandler from "express-async-handler";
import { TagModel } from "../models/tag.model";
import { AppError } from "../errors/app-error";
import { TaskModel } from "../models/task.model";

export const seedTags = asyncHandler(async (req, res) => {
  const tagCount = await TagModel.countDocuments();

  if (tagCount > 0) {
    res.send("Tag have been already seeded.");
    return;
  }

  await TagModel.create(sample_tags);
  res.send("Tag seed is done.");
});

export const getTags = asyncHandler(async (req, res) => {
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
});

export const createTag = asyncHandler(async (req, res) => {
  const newTag = new TagModel(req.body);

  if (!newTag.name || !newTag.emoji) {
    throw new AppError(400, "Name and emoji are required.");
  }

  const savedTag = await newTag.save();

  res.status(201).json({
    message: "New tag created.",
    data: savedTag,
  });
});

export const deleteTag = asyncHandler(async (req, res) => {
  const tagId = req.params.tagId;

  if (!tagId) {
    throw new AppError(400, "Tag id is required.");
  }

  const tagDelete = await TagModel.findById(tagId);

  if (!tagDelete) {
    throw new AppError(404, "Tag not found.");
  }

  await TaskModel.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

  await tagDelete.deleteOne();

  res.status(200).json({
    message: "Tag was successfully deleted.",
  });
});
