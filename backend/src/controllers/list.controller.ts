// import { sample_lists } from "../data";
import asyncHandler from "express-async-handler";
import { ListModel } from "../models/list.model";
import { AppError } from "../errors/app-error";
import { TaskModel } from "../models/task.model";
import { Request, Response } from "express";

// export const seedList = asyncHandler(async (req, res) => {
//   const listCount = await ListModel.countDocuments();

//   if (listCount > 0) {
//     res.send("List have been already seeded.");
//     return;
//   }

//   await ListModel.create(sample_lists);
//   res.send("List seed is done.");
// });

export const getLists = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const lists = await ListModel.find({ user: userId });
  const all = req.query.all === "true";

  if (!lists || lists.length === 0) {
    res.status(200).json([]);
    return;
  }

  if (all) {
    res.status(200).json(lists);
  } else {
    const limit = 2;
    res.status(200).json(lists.slice(0, limit));
  }
});

export const createList = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const listCount = await ListModel.countDocuments({ user: userId });

  if (listCount >= 5) {
    throw new AppError(
      403,
      "List limit reached. You can only have up to 5 lists per account."
    );
  }

  const newList = new ListModel({
    ...req.body,
    user: userId,
  });

  if (!newList.name || newList.name.trim() === "") {
    throw new AppError(400, "Name is required.");
  }

  const savedList = await newList.save();

  res.status(201).json({
    message: "New list created.",
    data: savedList,
  });
});

export const deleteList = asyncHandler(async (req: Request, res: Response) => {
  const listId = req.params.listId;
  const userId = req.user.id;

  if (!listId) {
    throw new AppError(400, "List id is required.");
  }

  const listDelete = await ListModel.findOne({ _id: listId, user: userId });

  if (!listDelete) {
    throw new AppError(404, "List not found or unauthorized.");
  }

  await TaskModel.updateMany(
    { list: listId, user: userId },
    { $set: { list: null } }
  );

  await listDelete.deleteOne();

  res.status(200).json({ message: "List was successfully deleted." });
});
