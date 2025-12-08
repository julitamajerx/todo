import express from "express";
import cors from "cors";
import { sample_lists, sample_tags, sample_tasks } from "./data";
import { TaskSort } from "./enums/task-sort-enum";

const app = express();
const isActive = (t: any) => !t.isDeleted && !t.isCompleted;

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

//tasks?page=1
app.get("/api/tasks", (req, res) => {
  const { page, limit } = getPagination(req);

  const sortBy = req.query.sortBy || TaskSort.Inbox;
  const tag = req.query.tag || null;
  const list = req.query.list || null;

  let tasks = [...sample_tasks];

  if (sortBy === TaskSort.Completed) {
    tasks = tasks.filter((t) => t.isCompleted);
  } else if (sortBy === TaskSort.Deleted) {
    tasks = tasks.filter((t) => t.isDeleted);
  } else {
    tasks = tasks.filter((t) => isActive(t));

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    tasks = tasks.map((t) => ({
      ...t,
      dueDate: new Date(t.dueDate),
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

  if (tag) {
    tasks = tasks.filter((t) => t.tags?.some((x:any) => x.name === tag));
  }

  if (list) {
    tasks = tasks.filter((t) => t.list?.name === list);
  }

  const paginated = paginate(tasks, page, limit);

  res.send({
    total: tasks.length,
    page,
    limit,
    tasks: paginated,
  });
});

app.get("/api/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const task = sample_tasks.find((task) => task.id == taskId);
  res.send(task);
});

app.get("/api/tags", (req, res) => {
  //?all=true
  const all = req.query.all === "true";
  if (all) {
    res.send(sample_tags);
  } else {
    const limit = 3;
    return res.send(sample_tags.slice(0, limit));
  }
});

app.get("/api/lists", (req, res) => {
  //?all=true
  const all = req.query.all === "true";
  if (all) {
    res.send(sample_lists);
  } else {
    const limit = 3;
    return res.send(sample_lists.slice(0, limit));
  }
});

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

const port = 5000;

app.listen(port, () => {
  console.log("Served on http://localhost:" + port);
});
