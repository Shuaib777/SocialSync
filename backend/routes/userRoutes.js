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

const userRouter = express.Router();

userRouter
  .get("/profile/:username", getUserProfile)
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .post("/logout", protectRoute, logoutUser)
  .post("/followUnfollow/:id", protectRoute, followUnfollowUser)
  .patch("/update", protectRoute, updateUser);

export default userRouter;
