// routes/notificationRoutes.js

import express from "express";
import { isAuthenticateUser } from "../utils/auth.js";
import { getNotifications, markNotificationAsRead } from "../controllers/notificationController.js";


const router = express.Router();

router.get("/notification", isAuthenticateUser, getNotifications);
// routes/notificationRoute.js
router.put('/read-notification/:id', isAuthenticateUser, markNotificationAsRead);


export default router;
