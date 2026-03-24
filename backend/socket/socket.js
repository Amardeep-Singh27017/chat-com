import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-htcu.onrender.com/",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketmap = {}; // { userId: socketId }

export const getReciverSocketId = (receiverId) => {
  return userSocketmap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketmap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketmap));
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketmap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketmap));
    }
  });
});

export { app, io, server };
