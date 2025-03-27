"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessage = exports.getUsersForSideBars = void 0;
const messagemodel_1 = __importDefault(require("../model/messagemodel"));
const usermodel_1 = __importDefault(require("../model/usermodel"));
const cloudinary_1 = __importDefault(require("../middlewares/cloudinary"));
const fs_1 = __importDefault(require("fs"));
const socket_1 = require("../middlewares/socket");
// Get users for the sidebars
const getUsersForSideBars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUserId = req.user._id; // Ensure this is correctly set by your authentication middleware
        const filteredUsers = yield usermodel_1.default.find({ _id: { $ne: loggedInUserId } }).select("-password");
        console.log("Fetched users for sidebar:", filteredUsers); // Debugging
        res.status(200).json(filteredUsers);
    }
    catch (error) {
        console.log("Error in getUsersForSideBars:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUsersForSideBars = getUsersForSideBars;
// Get message for a particular user
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
        const messages = yield messagemodel_1.default.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.log("Some error occurred in message controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getMessage = getMessage;
// Send message to a user
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.body; // Extract text from the request body
        const { id: receiverId } = req.params; // Extract receiverId from URL params
        const senderId = req.user._id; // Extract senderId from authenticated user
        let imageUrl; // Variable to hold the Cloudinary image URL
        // Check if an image file was uploaded
        if (req.file) {
            // Upload the image file to Cloudinary
            const uploadResponse = yield cloudinary_1.default.uploader.upload(req.file.path, {
                resource_type: 'auto', // Automatically detect the resource type (image, video, etc.)
            });
            // If upload is successful, Cloudinary will return a response with secure_url
            imageUrl = uploadResponse.secure_url;
            // Delete the temporary file after uploading to Cloudinary
            fs_1.default.unlinkSync(req.file.path);
        }
        // Create a new message and save it to the database
        const newMessage = new messagemodel_1.default({
            senderId,
            receiverId,
            text,
            image: imageUrl, // This will be undefined if no image was uploaded
        });
        yield newMessage.save();
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        // Send back the newly created message
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.error('Error in sendMessage controller:', error); // Improved error logging
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.sendMessage = sendMessage;
