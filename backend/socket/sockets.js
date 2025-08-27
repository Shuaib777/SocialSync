import express from "express";
import http from "http";
import { Server } from "socket.io";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

export const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    // Notify others that this user is now online
    socket.broadcast.emit("userOnline", { _id: userId });
  });

  socket.on("isUserOnline", (userId) => {
    socket.emit("onlineUserStatus", {
      _id: userId,
      isOnline: onlineUsers.has(userId),
    });
  });

  socket.on(
    "messagesSeenServer",
    ({ conversationId, senderId, seenBy, messageIds }) => {
      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", {
          conversationId,
          seenBy,
          messageIds: messageIds,
        });
      }
    }
  );

  socket.on("disconnect", () => {
    for (let [uid, sid] of onlineUsers) {
      if (sid === socket.id) {
        onlineUsers.delete(uid);
        // Notify others that this user is now offline
        socket.broadcast.emit("userOffline", { _id: uid });
        break;
      }
    }
  });
});
