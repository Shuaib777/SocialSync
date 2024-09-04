import express from "express";
import {
  createPost,
  deletePost,
  getPostByPostId,
  getPostByUserId,
  getUserFeed,
  likeUnlikePost,
  replyToPost,
  updatePost,
} from "../controller/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const postRouter = express.Router();

postRouter
  .get("/getUserPosts/:userId", getPostByUserId)
  .get("/getPosts/:postId", getPostByPostId)
  .get("/feeds", protectRoute, getUserFeed)
  .post("/createPost", protectRoute, createPost)
  .delete("/deletePost/:postId", protectRoute, deletePost)
  .patch("/updatePost/:postId", protectRoute, updatePost)
  .patch("/likeUnlike/:postId", protectRoute, likeUnlikePost)
  .patch("/reply/:postId", protectRoute, replyToPost);

export default postRouter;
