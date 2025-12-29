import { TaskSort } from "../enums/task-sort-enum";
import { sample_tasks } from "../data";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { TaskModel } from "../models/task.model";
import { ListModel } from "../models/list.model";
import { TagModel } from "../models/tag.model";
import { AppError } from "../errors/app-error";

export const seedTasks = asyncHandler(async (req: any, res) => {
  const userId = req.user.id;
  const taskCount = await TaskModel.countDocuments({ user: userId });

  if (taskCount > 0) {
    res.send("Tasks have already been seeded.");
    return;
  }

  const tags = await TagModel.find({ user: userId });
  const lists = await ListModel.find({ user: userId });

  const tasksWithUser = sample_tasks.map((task) => {
    return {
      ...task,
      user: userId,
      list: task.list !== undefined ? lists[task.list]?._id : null,
      tags: task.tags
        ? task.tags
            .map((tagIndex: number) => tags[tagIndex]?._id)
            .filter((t: any) => t)
        : [],
    };
  });

  await TaskModel.create(tasksWithUser);
  res.send("Tasks seed is done.");
});

export const getTasks = asyncHandler(async (req: any, res) => {
  const userId = req.user.id;
  const { page, limit } = getPagination(req);
  const sortBy = req.query.sortBy || TaskSort.Inbox;
  const tagName = req.query.tag as string;
  const listName = req.query.list as string;

  const filter: any = { user: userId };

  if (sortBy === TaskSort.Completed) {
    filter.isCompleted = true;
  } else if (sortBy === TaskSort.Deleted) {
    filter.isDeleted = true;
  } else {
    filter.isDeleted = false;
    filter.isCompleted = false;

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));

    if (sortBy === TaskSort.Today) {
      filter.dueDate = { $gte: startOfToday, $lte: endOfToday };
    } else if (sortBy === TaskSort.Week) {
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      filter.dueDate = { $gte: startOfWeek, $lt: endOfWeek };
    }
  }

  if (tagName) {
    const tag = await TagModel.findOne({ name: tagName, user: userId });
    filter.tags = tag ? tag._id : new mongoose.Types.ObjectId();
  }

  if (listName) {
    const list = await ListModel.findOne({ name: listName, user: userId });
    filter.list = list ? list._id : new mongoose.Types.ObjectId();
  }

  const total = await TaskModel.countDocuments(filter);
  const tasks = await TaskModel.find(filter)
    .populate("list")
    .populate("tags")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  res.send({ total, page, limit, tasks });
});

export const getTaskById = asyncHandler(async (req: any, res) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;

  const task = await TaskModel.findOne({ _id: taskId, user: userId })
    .populate("tags")
    .populate("list")
    .lean();

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  res.send(task);
});

export const createTask = asyncHandler(async (req: any, res) => {
  const userId = req.user.id;

  if (!req.body.name) {
    throw new AppError(400, "Name is required.");
  }

  const newTask = new TaskModel({
    ...req.body,
    user: userId,
  });

  const savedTask = await newTask.save();
  res.status(201).json({ message: "New task created.", data: savedTask });
});

export const deleteTask = asyncHandler(async (req: any, res) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;

  const taskDelete = await TaskModel.findOne({ _id: taskId, user: userId });

  if (!taskDelete) {
    throw new AppError(404, "Task not found.");
  }

  taskDelete.isDeleted = true;
  await taskDelete.save();

  res.status(200).json({ message: "Task was successfully deleted." });
});

export const completeTask = asyncHandler(async (req: any, res) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;

  const taskComplete = await TaskModel.findOne({ _id: taskId, user: userId });

  if (!taskComplete) {
    throw new AppError(404, "Task not found.");
  }

  taskComplete.isCompleted = true;
  await taskComplete.save();

  res.status(200).json({ message: "Task was successfully completed." });
});

export const recoverTask = asyncHandler(async (req: any, res) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;

  const taskRecover = await TaskModel.findOne({ _id: taskId, user: userId });

  if (!taskRecover) {
    throw new AppError(404, "Task not found.");
  }

  taskRecover.isCompleted = false;
  taskRecover.isDeleted = false;
  await taskRecover.save();

  res.status(200).json({ message: "Task was successfully recovered." });
});

export const updateTask = asyncHandler(async (req: any, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;

  const updatedTask = await TaskModel.findOneAndUpdate(
    { _id: taskId, user: userId },
    { $set: req.body },
    { new: true, runValidators: true }
  )
    .populate("tags")
    .populate("list");

  if (!updatedTask) {
    throw new AppError(404, "Task not found.");
  }

  res
    .status(200)
    .json({ data: updatedTask, message: "Task was successfully updated." });
});

function getPagination(req: any) {
  return {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 15,
  };
}
