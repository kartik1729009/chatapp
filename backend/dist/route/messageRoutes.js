"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectroute_1 = require("../middlewares/protectroute");
const uploadmiddleware_1 = __importDefault(require("../middlewares/uploadmiddleware"));
const messagecontroller_1 = require("../controller/messagecontroller");
const router = express_1.default.Router();
router.get("/user", protectroute_1.protectedRoute, messagecontroller_1.getUsersForSideBars);
router.get("/:id", protectroute_1.protectedRoute, messagecontroller_1.getMessage);
router.post("/send/:id", protectroute_1.protectedRoute, uploadmiddleware_1.default.single('image'), messagecontroller_1.sendMessage);
exports.default = router;
