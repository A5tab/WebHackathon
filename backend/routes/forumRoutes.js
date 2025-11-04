import express from "express";
import {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from "../controllers/forumController.js";
// import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POSTS
router.post("/posts", createPost);
router.get("/posts", getAllPosts);
router.get("/posts/:id", getSinglePost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

// COMMENTS
router.post("/posts/:id/comments", createComment);
router.get("/posts/:id/comments", getCommentsByPost);
router.put("/comments/:id", updateComment);
router.delete("/comments/:id", deleteComment);

export default router;
