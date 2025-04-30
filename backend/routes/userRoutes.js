import express from "express";
import {
  followUnfollowUser,
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
} from "../controller/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
import multer from "multer";

const userRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

userRouter
  .get("/profile/:username", getUserProfile)
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .post("/logout", protectRoute, logoutUser)
  .post("/followUnfollow/:id", protectRoute, followUnfollowUser)
  .patch("/update", protectRoute, upload.single("profilePic"), updateUser);

export default userRouter;
