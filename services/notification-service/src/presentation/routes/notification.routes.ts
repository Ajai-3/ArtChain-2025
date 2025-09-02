    import express from "express";
    import { notificationController } from "../../infrastructure/container/notificationContainer";

    const router = express.Router();

    router.get("/", notificationController.getUserNotifications);
    router.get("/unread-count", notificationController.getUnreadCount);
    router.patch("/:id/read", notificationController.markAsRead);
    router.patch("/mark-all-read", notificationController.markAllAsRead);

    export default router;
