import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { dbConnect } from './config/dbconnect';
import cookieParser from 'cookie-parser';
import userRoutes from './route/routes';
import messageRoutes from './route/messageRoutes';
import cors from 'cors';

import { app, server } from "./middlewares/socket"
// Load environment variables
dotenv.config();


// Enable CORS if working with different origins (frontend-backend separation)
app.use(cors({
  origin: 'http://localhost:5173',  // Adjust this if your frontend is running on a different URL/port
  credentials: true,  // Allow cookies to be sent with requests
}));

// Use cookie-parser middleware to parse cookies from requests
app.use(cookieParser());

// Parse JSON body requests
app.use(express.json());

// Connect to MongoDB database
dbConnect();

// Define routes
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running successfully at port ${PORT}`);
});
