import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../model/usermodel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cloudinary from '../middlewares/cloudinary';
import fs from 'fs';
dotenv.config();

// Signup function
export const signup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists, please login',
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Error in hashing the password',
      });
    }

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: 'User entry created successfully',
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: 'User entry not created',
    });
  }
};

// Login function
// Login function
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all the details',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User doesn’t exist, please signup',
      });
    }

    // Payload for JWT
    const payload = {
      userId: user._id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,  // JWT expiration in seconds
    };

    if (await bcrypt.compare(password, user.password)) {
      // Sign the JWT without `expiresIn`, as it's already in the payload
      const token = jwt.sign(payload, process.env.JWT_SECRET!);

      // Set JWT as a cookie
      const options = {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Ensure it's secure in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry (same as JWT expiration time)
      };

      res.cookie("jwt", token, options);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};
export const logout = (req:Request, res:Response) => {
  try{
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({message:"logout successfully"});
  }catch(error){
    console.log("error in logout controller");
    res.status(500).json({message:"internal server error"});
  }
};
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id; // Extract user ID from authenticated user

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Upload the image file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto', // Automatically detect the resource type (image, video, etc.)
    });

    // Delete the temporary file after uploading to Cloudinary
    fs.unlinkSync(req.file.path);

    // Update the user's profile picture in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url }, // Use the Cloudinary URL in the profilePic
      { new: true } // Return the updated user document
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const checkAuth = (req:Request, res:Response)=>{
  try{
    res.status(200).json(req.user);
  }
  catch(error){
    console.log("error in checkAuth controller", error);
    res.status(500).json({message:"internal server error"});
  }
}