import { Request, Response, NextFunction } from "express";
import { INotificationController } from "../interface/INotificationController";
import { MarkAsReadUseCase } from "../../application/usecases/MarkAsReadUseCase";
import { MarkAllAsReadUseCase } from "../../application/usecases/MarkAllAsReadUseCase";
import { GetUnreadCountUseCase } from "../../application/usecases/GetUnreadCountUseCase";
import { GetUserNotificationsUseCase } from "../../application/usecases/GetUserNotificationsUseCase";

export class NotificationController implements INotificationController {
  constructor(
    private readonly _getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private readonly _getUnreadCountUseCase: GetUnreadCountUseCase,
    private readonly _markAsReadUseCase: MarkAsReadUseCase,
    private readonly _markAllAsReadUseCase: MarkAllAsReadUseCase
  ) {}

  //# ================================================================================================================
  //# GET USER NOTIFICATIONS
  //# ================================================================================================================
  //# GET /api/v1/notifications
  //# Request headers: x-user-id
  //# This controller returns all notifications for the current user, sorted by newest first.
  //# ================================================================================================================
  getUserNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const notifications = await this._getUserNotificationsUseCase.execute(
        userId
      );
      return res.json({ notifications });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
 //# GET UNREAD NOTIFICATIONS COUNT
  //# ================================================================================================================
  //# GET /api/v1/notifications/unread-count
  //# Request headers: x-user-id
  //# This controller returns the number of unread notifications for the current user.
  //# ================================================================================================================
  getUnreadCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const count = await this._getUnreadCountUseCase.execute(userId);
      return res.json({ unreadCount: count });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# MARK NOTIFICATION AS READ
  //# ================================================================================================================
  //# PATCH /api/v1/notifications/:id/read
  //# Request params: id
  //# This controller marks a single notification as read by its ID.
  //# ================================================================================================================
  markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { id } = req.params;
      await this._markAsReadUseCase.execute(id);
      return res.json({ message: "Notification marked as read" });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# MARK ALL NOTIFICATIONS AS READ
  //# ================================================================================================================
  //# PATCH /api/v1/notifications/mark-all-read
  //# Request headers: x-user-id
  //# This controller marks all notifications of the current user as read.
  //# ================================================================================================================
  markAllAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      await this._markAllAsReadUseCase.execute(userId);
      return res.json({ message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  };
}
