import { Response, Request } from "express";
import Message from "../model/messagemodel";
import User from "../model/usermodel";
import cloudinary from "../middlewares/cloudinary";
import fs from 'fs';
import { getReceiverSocketId, io } from "../middlewares/socket";


// Get users for the sidebars
export const getUsersForSideBars = async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInUserId = req.user._id; // Ensure this is correctly set by your authentication middleware
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    console.log("Fetched users for sidebar:", filteredUsers); // Debugging
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSideBars:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get message for a particular user
export const getMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Some error occurred in message controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Send message to a user

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body; // Extract text from the request body
    const { id: receiverId } = req.params; // Extract receiverId from URL params
    const senderId = req.user._id; // Extract senderId from authenticated user

    let imageUrl: string | undefined; // Variable to hold the Cloudinary image URL

    // Check if an image file was uploaded
    if (req.file) {
      // Upload the image file to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'auto', // Automatically detect the resource type (image, video, etc.)
      });

      // If upload is successful, Cloudinary will return a response with secure_url
      imageUrl = uploadResponse.secure_url;

      // Delete the temporary file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);
    }

    // Create a new message and save it to the database
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl, // This will be undefined if no image was uploaded
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Send back the newly created message
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error in sendMessage controller:', error); // Improved error logging
    res.status(500).json({ message: 'Internal server error', error});
  }
};
