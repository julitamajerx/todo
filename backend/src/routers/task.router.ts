import { Router } from "express";
import { TaskSort } from "../enums/task-sort-enum";
import { sample_tasks } from "../data";
import asyncHandler from "express-async-handler";
import { TaskModel } from "../models/task.model";
import { ListModel } from "../models/list.model";
import { TagModel } from "../models/tag.model";
import { AppError } from "../errors/app-error";

const router = Router();
const isActive = (t: any) => !t.isDeleted && !t.isCompleted;

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const taskCount = await TaskModel.countDocuments();

    if (taskCount > 0) {
      res.send("Tasks have already been seeded.");
      return;
    }

    const tags = await TagModel.find();
    const lists = await ListModel.find();

    const createdTasks = await TaskModel.create(
      sample_tasks.map((task) => {
        return {
          ...task,
          list: task.list !== undefined ? lists[task.list]._id : null,
          tags: task.tags
            ? task.tags.map((tagIndex: number) => tags[tagIndex]._id)
            : [],
        };
      })
    );

    res.send("Tasks seed is done.");
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page, limit } = getPagination(req);

    const sortBy = req.query.sortBy || TaskSort.Inbox;
    const tagName = req.query.tag || null;
    const listName = req.query.list || null;

    let tasks = await TaskModel.find().populate("list").populate("tags").lean();

    if (tasks.length === 0) {
      throw new AppError(404, "Tasks not found.");
    }

    if (sortBy === TaskSort.Completed) {
      tasks = tasks.filter((t) => t.isCompleted);
    } else if (sortBy === TaskSort.Deleted) {
      tasks = tasks.filter((t) => t.isDeleted);
    } else {
      tasks = tasks.filter((t) => isActive(t));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfToday = today;
      const endOfToday = new Date(today);
      endOfToday.setDate(endOfToday.getDate() + 1);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      tasks = tasks.map((t) => ({
        ...t,
        dueDate: t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate),
      }));

      if (sortBy === TaskSort.Today) {
        tasks = tasks.filter(
          (t) => t.dueDate >= startOfToday && t.dueDate < endOfToday
        );
      } else if (sortBy === TaskSort.Week) {
        tasks = tasks.filter(
          (t) => t.dueDate >= startOfWeek && t.dueDate < endOfWeek
        );
      }
    }

    if (tagName) {
      tasks = tasks.filter((t) =>
        (t.tags as Array<any>)?.some((x: any) => x.name === tagName)
      );
    }

    if (listName) {
      tasks = tasks.filter((t) => (t.list as any)?.name === listName);
    }

    const paginated = paginate(tasks, page, limit);

    res.send({
      total: tasks.length,
      page,
      limit,
      tasks: paginated,
    });
  })
);

router.get(
  "/:taskId",
  asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;
    const task = await TaskModel.findById(taskId)
      .populate("tags")
      .populate("list")
      .lean();

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    res.send(task);
  })
);

router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const newTask = new TaskModel(req.body);

    if (!newTask.name) {
      throw new AppError(400, "Name is required.");
    }

    const savedTask = await newTask.save();

    res.status(201).json({
      messege: "New task created.",
      task: savedTask,
    });
  })
);

router.delete(
  "/delete/:taskId",
  asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;

    if (!taskId) {
      throw new AppError(400, "Task id is required.");
    }

    const taskDelete = await TaskModel.findById(taskId);

    if (!taskDelete) {
      throw new AppError(404, "Task not found.");
    }

    taskDelete.isDeleted = true;
    await taskDelete.save();

    res.status(200).json({
      messege: "Task was successfully deleted.",
    });
  })
);

router.patch(
  "/complete/:taskId",
  asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;

    if (!taskId) {
      throw new AppError(400, "Task id is required.");
    }

    const taskComplete = await TaskModel.findById(taskId);

    if (!taskComplete) {
      throw new AppError(404, "Task not found.");
    }

    taskComplete.isCompleted = true;
    await taskComplete.save();

    res.status(200).json({
      messege: "Task was successfully completed.",
    });
  })
);

function paginate<T>(items: T[], page: number, limit: number): T[] {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return items.slice(startIndex, endIndex);
}

function getPagination(req: any) {
  return {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 15,
  };
}

export default router;
