import { sample_lists } from "../data";
import asyncHandler from "express-async-handler";
import { ListModel } from "../models/list.model";
import { AppError } from "../errors/app-error";
import { TaskModel } from "../models/task.model";

export const seedList = asyncHandler(async (req, res) => {
  const listCount = await ListModel.countDocuments();

  if (listCount > 0) {
    res.send("List have been already seeded.");
    return;
  }

  await ListModel.create(sample_lists);
  res.send("List seed is done.");
});

export const getLists = asyncHandler(async (req, res) => {
  const lists = await ListModel.find();
  const all = req.query.all === "true";

  if (lists.length === 0) {
    throw new AppError(404, "Lists not found");
  }

  if (all) {
    res.send(lists);
  } else {
    const limit = 3;
    res.send(lists.slice(0, limit));
  }
});

export const createList = asyncHandler(async (req, res) => {
  const newList = new ListModel(req.body);

  if (!newList.name) {
    throw new AppError(400, "Name is required.");
  }

  const savedList = await newList.save();

  res.status(201).json({
    message: "New list created.",
    data: savedList,
  });
});

export const deleteList = asyncHandler(async (req, res) => {
  const listId = req.params.listId;

  if (!listId) {
    throw new AppError(400, "List id is required.");
  }

  const listDelete = await ListModel.findById(listId);

  if (!listDelete) {
    throw new AppError(404, "List not found.");
  }

  await TaskModel.updateMany({ list: listId }, { $set: { list: null } });

  await listDelete.deleteOne();

  res.status(200).json({
    message: "List was successfully deleted.",
  });
});
