// src/express.d.ts
import { User } from './model/usermodel'; // Adjust the import path based on where your User model is located.

declare global {
  namespace Express {
    interface Request {
      user?: User; // Extend the Request interface with the `user` property
    }
  }
}
