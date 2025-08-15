import express from "express";
import http from "http";
import { Server } from "socket.io";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export const onlineUsers = new Map();

io.on("connection", (socket) => {
  //   console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    // console.log("Registered:", userId);
  });

  socket.on("disconnect", () => {
    for (let [uid, sid] of onlineUsers) {
      if (sid === socket.id) {
        onlineUsers.delete(uid);
        break;
      }
    }
    // console.log("Socket disconnected:", socket.id);
  });
});
