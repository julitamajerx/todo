import express from "express";
import cors from "cors";
import { sample_lists, sample_tags, sample_tasks } from "./data";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  }),
);

app.get("/api/tasks", (req, res) => {
  res.send(sample_tasks);
});

app.get("/api/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const task = sample_tasks.find((task) => task.id == taskId);
  res.send(task);
});

app.get("/api/tags", (req, res) => {
  res.send(sample_tags);
});

app.get("/api/lists", (req, res) => {
  res.send(sample_lists);
});

const port = 5000;

app.listen(port, () => {
  console.log("Served on http://localhost:" + port);
});
