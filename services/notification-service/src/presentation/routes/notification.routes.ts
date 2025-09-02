import express from "express";
import { notificationContainer } from "../../infrastructure/container/notificationContainer";


const router = express.Router();

router.get("/", notificationContainer.getUserNotifications);
router.get("/unread-count", notificationContainer.getUnreadCount);
router.patch("/:id/read", notificationContainer.markAsRead);
router.patch("/mark-all-read", notificationContainer.markAllAsRead);

export default router;