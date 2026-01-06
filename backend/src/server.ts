import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { dbConnect } from "./configs/database.config";
import taskRouter from "./routers/task.router";
import listRouter from "./routers/list.router";
import tagRouter from "./routers/tag.router";
import userRouter from "./routers/user.router";
import { errorMiddleware } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import { authHandler } from "./middlewares/authHandler";
import { initCleanupJob } from "./cron/cleanup";

dbConnect();
initCleanupJob();

const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200", "https://julitamajerx.github.io"],
  })
);

app.use(cookieParser());

app.use("/api/tasks", authHandler, taskRouter);
app.use("/api/lists", authHandler, listRouter);
app.use("/api/tags", authHandler, tagRouter);
app.use("/api/user", userRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Served on " + port);
});

app.use(errorMiddleware);
