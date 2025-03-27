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
exports.checkAuth = exports.updateProfile = exports.logout = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const usermodel_1 = __importDefault(require("../model/usermodel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = __importDefault(require("../middlewares/cloudinary"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
// Signup function
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = req.body;
        const existingUser = yield usermodel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists, please login',
            });
        }
        let hashedPassword;
        try {
            hashedPassword = yield bcrypt_1.default.hash(password, 10);
        }
        catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Error in hashing the password',
            });
        }
        const user = yield usermodel_1.default.create({
            fullName,
            email,
            password: hashedPassword,
        });
        return res.status(200).json({
            success: true,
            message: 'User entry created successfully',
        });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: 'User entry not created',
        });
    }
});
exports.signup = signup;
// Login function
// Login function
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the details',
            });
        }
        const user = yield usermodel_1.default.findOne({ email });
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
            exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // JWT expiration in seconds
        };
        if (yield bcrypt_1.default.compare(password, user.password)) {
            // Sign the JWT without `expiresIn`, as it's already in the payload
            const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
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
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong',
        });
    }
});
exports.login = login;
const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "logout successfully" });
    }
    catch (error) {
        console.log("error in logout controller");
        res.status(500).json({ message: "internal server error" });
    }
};
exports.logout = logout;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id; // Extract user ID from authenticated user
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Profile picture is required" });
        }
        // Upload the image file to Cloudinary
        const uploadResponse = yield cloudinary_1.default.uploader.upload(req.file.path, {
            resource_type: 'auto', // Automatically detect the resource type (image, video, etc.)
        });
        // Delete the temporary file after uploading to Cloudinary
        fs_1.default.unlinkSync(req.file.path);
        // Update the user's profile picture in the database
        const updatedUser = yield usermodel_1.default.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, // Use the Cloudinary URL in the profilePic
        { new: true } // Return the updated user document
        );
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.log("Error in updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateProfile = updateProfile;
const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("error in checkAuth controller", error);
        res.status(500).json({ message: "internal server error" });
    }
};
exports.checkAuth = checkAuth;
