import express from "express";
import cors from "cors";
import { sample_lists, sample_tags, sample_tasks } from "./data";

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

  res.send(paginate(sample_tasks, page, limit));
});

app.get("/api/tasks/today", (req, res) => {
  const { page, limit } = getPagination(req);

  const today = new Date();
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  const tasks = sample_tasks.filter(
    (t) => t.dueDate >= start && t.dueDate < end && isActive(t)
  );

  res.send(paginate(tasks, page, limit));
});

app.get("/api/tasks/week", (req, res) => {
  const { page, limit } = getPagination(req);

  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  const tasks = sample_tasks.filter(
    (t) => t.dueDate >= start && t.dueDate < end && isActive(t)
  );

  res.send(paginate(tasks, page, limit));
});

app.get("/api/tasks/deleted", (req, res) => {
  const { page, limit } = getPagination(req);

  const tasks = sample_tasks.filter((t) => t.isDeleted);
  res.send(paginate(tasks, page, limit));
});

app.get("/api/tasks/tag/:tagName", (req, res) => {
  const { page, limit } = getPagination(req);

  const tagName = req.params.tagName;

  const tasks = sample_tasks.filter(
    (t) =>
      t.tags?.some((tagItem: any) => tagItem.name === tagName) && isActive(t)
  );

  res.send(paginate(tasks, page, limit));
});

app.get("/api/tasks/list/:listName", (req, res) => {
  const { page, limit } = getPagination(req);

  const list = req.params.listName;
  const tasks = sample_tasks.filter(
    (t) => t.list?.name === list && isActive(t)
  );
  res.send(paginate(tasks, page, limit));
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
