// import { sample_tags } from "../data";
import asyncHandler from "express-async-handler";
import { TagModel } from "../models/tag.model";
import { AppError } from "../errors/app-error";
import { TaskModel } from "../models/task.model";
import { Request, Response } from "express";

// export const seedTags = asyncHandler(async (req, res) => {
//   const tagCount = await TagModel.countDocuments();

//   if (tagCount > 0) {
//     res.send("Tag have been already seeded.");
//     return;
//   }

//   await TagModel.create(sample_tags);
//   res.send("Tag seed is done.");
// });

export const getTags = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const tags = await TagModel.find({ user: userId });
  const all = req.query.all === "true";

  if (!tags || tags.length === 0) {
    res.status(200).json([]);
    return;
  }
  if (all) {
    res.status(200).json(tags);
  } else {
    const limit = 2;
    res.status(200).json(tags.slice(0, limit));
  }
});

export const createTag = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const tagCount = await TagModel.countDocuments({ user: userId });

  if (tagCount >= 5) {
    throw new AppError(
      403,
      "Tag limit reached. You can only have up to 5 tags per account."
    );
  }

  const newTag = new TagModel({
    ...req.body,
    user: userId,
  });

  if (!newTag.name || newTag.name.trim() === "") {
    throw new AppError(400, "Tag name is required.");
  }

  if (!newTag.emoji || newTag.emoji.trim() === "") {
    throw new AppError(400, "You must select an emoji for the tag.");
  }

  const savedTag = await newTag.save();

  res.status(201).json({
    message: "New tag created.",
    data: savedTag,
  });
});

export const deleteTag = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const tagId = req.params.tagId;

  if (!tagId) {
    throw new AppError(400, "Tag id is required.");
  }

  const tagDelete = await TagModel.findOne({ _id: tagId, user: userId });

  if (!tagDelete) {
    throw new AppError(404, "Tag not found.");
  }

  await TaskModel.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

  await tagDelete.deleteOne();

  res.status(200).json({
    message: "Tag was successfully deleted.",
  });
});
