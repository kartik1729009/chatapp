"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbconnect_1 = require("./config/dbconnect");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./route/routes"));
const messageRoutes_1 = __importDefault(require("./route/messageRoutes"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./middlewares/socket");
// Load environment variables
dotenv_1.default.config();
// Enable CORS if working with different origins (frontend-backend separation)
socket_1.app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Adjust this if your frontend is running on a different URL/port
    credentials: true, // Allow cookies to be sent with requests
}));
// Use cookie-parser middleware to parse cookies from requests
socket_1.app.use((0, cookie_parser_1.default)());
// Parse JSON body requests
socket_1.app.use(express_1.default.json());
// Connect to MongoDB database
(0, dbconnect_1.dbConnect)();
// Define routes
socket_1.app.use('/api/auth', routes_1.default);
socket_1.app.use('/api/messages', messageRoutes_1.default);
// Start the server
const PORT = process.env.PORT || 3000;
socket_1.server.listen(PORT, () => {
    console.log(`Server running successfully at port ${PORT}`);
});
