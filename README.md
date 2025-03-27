Real-Time Chat API (Backend)
A robust, type-safe backend for real-time chat applications built with TypeScript, Socket.io, and MongoDB. Ready to integrate with any frontend framework.

✨ Features

User Authentication
JWT-based signup/login
Password hashing with bcrypt
Protected routes
Session management
Real-Time Communication
Socket.io for instant messaging
Typing indicators
Online status tracking
Read receipts
Media Handling
Profile picture uploads (cloudinary/local storage)
Image sharing in chats
File validation middleware
Database
MongoDB with Mongoose
Type-safe models with TypeScript
Optimized queries
🛠️ Tech Stack

Runtime: Node.js
Language: TypeScript
Web Framework: Express
Real-Time: Socket.io
Database: MongoDB + Mongoose
Authentication: JWT
File Uploads: Multer
Environment: Dotenv
🚀 Quick Start

Prerequisites

Node.js v16+
MongoDB Atlas URI or local instance


git clone https://github.com/yourusername/chat-backend.git
cd chat-backend

npm install

cp .env.example .env

npm run dev
