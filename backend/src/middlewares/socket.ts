import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Frontend URL
  },
});

// Define a type for userSocketMap
interface UserSocketMap {
  [userId: string]: string; // Maps userId (string) to socketId (string)
}

// Initialize userSocketMap
const userSocketMap: UserSocketMap = {};

// Function to get the receiver's socket ID
export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}

// Handle socket connections
io.on("connection", (socket: Socket) => {
  console.log("A user connected", socket.id);

  // Extract userId from the query parameters
  const userId = socket.handshake.query.userId;

  // Ensure userId is a string before using it
  if (typeof userId === "string") {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  }

  // Emit the list of online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    // Remove the user from the map on disconnect
    if (typeof userId === "string" && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
      console.log(`User ${userId} removed from mapping`);
    }

    // Emit the updated list of online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };