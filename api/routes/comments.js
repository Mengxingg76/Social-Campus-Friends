import express from "express";
import {
  getComments,
  addComment,
  getCommentsCount,
} from "../controllers/comment.js";

const router = express.Router();

router.get("/", getComments);
router.post("/", addComment);
router.get("/count", getCommentsCount);

export default router;
