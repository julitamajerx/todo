import { Router } from "express";
import { sample_lists } from "../data";
import asyncHandler from "express-async-handler";
import { ListModel } from "../models/list.model";
import { AppError } from "../errors/app-error";

const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const listCount = await ListModel.countDocuments();

    if (listCount > 0) {
      res.send("List have been already seeded.");
      return;
    }

    await ListModel.create(sample_lists);
    res.send("List seed is done.");
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
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
  })
);

export default router;
