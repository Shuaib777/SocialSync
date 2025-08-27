import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/connectDB.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import chatRouter from "./routes/chatRoutes.js";
import { app, server } from "./socket/Socket.js";

dotenv.config();
connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users/", userRouter);
app.use("/api/posts/", postRouter);
app.use("/api/chat", chatRouter);

server.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
