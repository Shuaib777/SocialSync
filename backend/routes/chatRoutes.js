import express from "express";
import {
  createMessage,
  getConversations,
  getMessages,
} from "../controller/chatController.js";
import protectRoute from "../middlewares/protectRoute.js";

const chatRouter = express.Router();

chatRouter
  .post("/createMessage", protectRoute, createMessage)
  .get("/getMessages/:recipientId", protectRoute, getMessages)
  .get("/getConversations", protectRoute, getConversations);

export default chatRouter;
