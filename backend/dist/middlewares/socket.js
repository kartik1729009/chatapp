"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = exports.io = void 0;
exports.getReceiverSocketId = getReceiverSocketId;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:5173"], // Frontend URL
    },
});
exports.io = io;
// Initialize userSocketMap
const userSocketMap = {};
// Function to get the receiver's socket ID
function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}
// Handle socket connections
io.on("connection", (socket) => {
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
