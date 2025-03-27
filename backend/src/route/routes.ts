// route/routes.ts

import express from 'express';
import { signup, login, logout, updateProfile, checkAuth } from '../controller/authcontroller';  // Ensure correct import
import upload from '../middlewares/uploadmiddleware'; 
import { protectedRoute } from '../middlewares/protectroute'
const router = express.Router();

// Use the signup and login handlers directly
router.post('/signup', signup);  // signup handler is async, no need to wrap it in another async function
router.post('/login', login);    // login handler is async, no need to wrap it in another async function
router.post('/logout', logout);
router.put('/update-profile', protectedRoute, upload.single('profilePic'), updateProfile);
router.get("/check", protectedRoute, checkAuth);
export default router;
