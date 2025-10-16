import express from "express";
import { TYPES } from "../../infrastructure/inversify/types";
import { container } from "../../infrastructure/inversify/inversify.config";
import { INotificationController } from "../interface/INotificationController";

const router = express.Router();

const notificationController = container.get<INotificationController>(
  TYPES.INotificationController
);

router.get("/", notificationController.getUserNotifications);
router.get("/unread-count", notificationController.getUnreadCount);
router.patch("/:id/read", notificationController.markAsRead);
router.patch("/mark-all-read", notificationController.markAllAsRead);

export default router;
