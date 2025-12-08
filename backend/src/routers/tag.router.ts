import { Router } from 'express';
import { sample_tags } from '../data';
import asyncHandler from 'express-async-handler';
import { TagModel } from '../models/tag.model';

const router = Router();

router.get("/seed", asyncHandler(
  async (req, res) => {
    const tagCount = await TagModel.countDocuments();

    if(tagCount>0){
      res.send("Tag have been already seeded.");
      return;
    }

    await TagModel.create(sample_tags);
    res.send("Tag seed is done.")
  }
));

router.get("/", (req, res) => {
  //?all=true
  const all = req.query.all === "true";
  if (all) {
    res.send(sample_tags);
  } else {
    const limit = 3;
    return res.send(sample_tags.slice(0, limit));
  }
});

export default router;