import { Router } from 'express';
import { sample_lists } from '../data';

const router = Router();

router.get("/", (req, res) => {
  //?all=true
  const all = req.query.all === "true";
  if (all) {
    res.send(sample_lists);
  } else {
    const limit = 3;
    return res.send(sample_lists.slice(0, limit));
  }
});

export default router;