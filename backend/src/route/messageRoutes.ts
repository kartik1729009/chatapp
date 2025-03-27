import express from 'express'
import { protectedRoute } from '../middlewares/protectroute';
import upload from '../middlewares/uploadmiddleware'; 
import { getUsersForSideBars, getMessage, sendMessage } from '../controller/messagecontroller';
const router = express.Router();
router.get("/user", protectedRoute, getUsersForSideBars);
router.get("/:id", protectedRoute, getMessage);
router.post("/send/:id", protectedRoute, upload.single('image'), sendMessage);
export default router;
