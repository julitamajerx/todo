import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { dbConnect } from "./configs/database.config";
import taskRouter from "./routers/task.router";
import listRouter from "./routers/list.router";
import tagRouter from "./routers/tag.router";

dbConnect();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

app.use("/api/tasks", taskRouter);
app.use("/api/lists", listRouter);
app.use("/api/tags", tagRouter);

const port = 5000;

app.listen(port, () => {
  console.log("Served on http://localhost:" + port);
});
