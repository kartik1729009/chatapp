# 💬 Real-Time Chat API (Backend)

A **robust, type-safe backend** for real-time chat applications, built using **TypeScript**, **Socket.io**, and **MongoDB**. Designed to be secure, scalable, and easily pluggable into any frontend framework (React, Vue, Angular, etc.).

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based **Signup/Login**
- **Password Hashing** using bcrypt
- **Protected Routes** middleware
- **Session Management**

### 📡 Real-Time Communication
- **Socket.io** for real-time, bidirectional messaging
- **Typing Indicators**
- **Online/Offline Status Tracking**
- **Read Receipts** for message delivery

### 🖼️ Media Handling
- **Profile Picture Uploads** (Cloudinary/local)
- **Image Sharing** in chats
- **Multer Middleware** for file validation and type-checking

### 🧠 Database & Models
- MongoDB + Mongoose for storage
- Fully **type-safe models** using TypeScript
- **Optimized queries** and lean fetching

---

## 🛠️ Tech Stack

| Layer           | Tech                            |
|----------------|----------------------------------|
| Runtime         | Node.js                         |
| Language        | TypeScript                      |
| Web Framework   | Express                         |
| Real-Time       | Socket.io                       |
| Database        | MongoDB with Mongoose           |
| Authentication  | JWT                             |
| File Uploads    | Multer + Cloudinary/Local       |
| Environment     | Dotenv for environment configs  |

---



---

## ⚡ How It Works

1. **Users Register or Login** via JWT-secured APIs.
2. **Socket.io connects users** for real-time updates.
3. **Chat messages, typing indicators**, and **read receipts** are emitted and stored.
4. **Media files** are uploaded (Cloudinary/local) and attached to chats.
5. Users can view **chat history**, online status, and read receipts.

---

## 🚀 Quick Start

### 📋 Prerequisites

- Node.js v16+
- MongoDB Atlas URI (or local MongoDB instance)
- (Optional) Cloudinary credentials if using cloud image storage

---

### 🔧 Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/chat-backend.git
cd chat-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env


# Then edit .env with your keys

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


#To run
cd backend
node dist/index.js

