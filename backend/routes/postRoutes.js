import express from "express";
import {
  createPost,
  deletePost,
  getPostByPostId,
  getPostByUserId,
  getUserFeed,
  likeUnlikePost,
  likeUnlikePostReply,
  replyToPost,
  updatePost,
} from "../controller/postController.js";
import protectRoute from "../middlewares/protectRoute.js";
import multer from "multer";

const postRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

postRouter
  .get("/getUserPosts/:userId", getPostByUserId)
  .get("/getPosts/:postId", getPostByPostId)
  .get("/feeds", protectRoute, getUserFeed)
  .post("/createPost", protectRoute, upload.single("postImage"), createPost)
  .delete("/deletePost/:postId", protectRoute, deletePost)
  .patch(
    "/updatePost/:postId",
    protectRoute,
    upload.single("updatedPostImage"),
    updatePost
  )
  .patch("/likeUnlike/:postId", protectRoute, likeUnlikePost)
  .patch("/likeUnlikeReply/:postId/:replyId", protectRoute, likeUnlikePostReply)
  .patch("/reply/:postId", protectRoute, replyToPost);

export default postRouter;
