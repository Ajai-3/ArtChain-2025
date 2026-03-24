import express from 'express';
import { ROUTES } from '../../constants/routes';
import { TYPES } from '../../infrastructure/inversify/types';
import { container } from '../../infrastructure/inversify/inversify.config';
import { INotificationController } from '../interface/INotificationController';

const router = express.Router();

const notificationController = container.get<INotificationController>(
  TYPES.INotificationController
);

router.get(ROUTES.NOTIFICATIONS.ROOT, notificationController.getUserNotifications);
router.get(ROUTES.NOTIFICATIONS.UNREAD_COUNT, notificationController.getUnreadCount);
router.patch(ROUTES.NOTIFICATIONS.MARK_AS_READ, notificationController.markAsRead);
router.patch(ROUTES.NOTIFICATIONS.MARK_ALL_AS_READ, notificationController.markAllAsRead);

export default router;
