import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/usermodel';

function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined;
}

export const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt; // Get JWT from cookies
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }; // Typecasting the decoded token
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // Find the user from the database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Add user to request object to access in other routes
    req.user = user;  // Now, TypeScript knows that req.user exists.

    // Move to the next middleware or route handler
    next();
  } catch (error: unknown) {
    if (isError(error)) {
      console.log("Error in protectedRoute middleware", error.message);
      res.status(500).json({ message: "Internal server error" });
    } else {
      console.log("Unknown error", error);
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
