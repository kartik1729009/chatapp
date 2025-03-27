"use strict";
// route/routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authcontroller_1 = require("../controller/authcontroller"); // Ensure correct import
const uploadmiddleware_1 = __importDefault(require("../middlewares/uploadmiddleware"));
const protectroute_1 = require("../middlewares/protectroute");
const router = express_1.default.Router();
// Use the signup and login handlers directly
router.post('/signup', authcontroller_1.signup); // signup handler is async, no need to wrap it in another async function
router.post('/login', authcontroller_1.login); // login handler is async, no need to wrap it in another async function
router.post('/logout', authcontroller_1.logout);
router.put('/update-profile', protectroute_1.protectedRoute, uploadmiddleware_1.default.single('profilePic'), authcontroller_1.updateProfile);
router.get("/check", protectroute_1.protectedRoute, authcontroller_1.checkAuth);
exports.default = router;
