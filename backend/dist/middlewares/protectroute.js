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
exports.protectedRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usermodel_1 = __importDefault(require("../model/usermodel"));
function isError(error) {
    return error.message !== undefined;
}
const protectedRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwt; // Get JWT from cookies
        if (!token) {
            return res.status(401).json({ message: "Unauthorized user" });
        }
        // Verify JWT token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // Typecasting the decoded token
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized user" });
        }
        // Find the user from the database
        const user = yield usermodel_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        // Add user to request object to access in other routes
        req.user = user; // Now, TypeScript knows that req.user exists.
        // Move to the next middleware or route handler
        next();
    }
    catch (error) {
        if (isError(error)) {
            console.log("Error in protectedRoute middleware", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
        else {
            console.log("Unknown error", error);
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
exports.protectedRoute = protectedRoute;
