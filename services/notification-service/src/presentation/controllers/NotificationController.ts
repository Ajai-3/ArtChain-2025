import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { logger } from "../../infrastructure/utils/logger";
import { TYPES } from "../../infrastructure/inversify/types";
import { IMarkAsReadUseCase } from "../../domain/usecases/IMarkAsReadUseCase";
import { INotificationController } from "../interface/INotificationController";
import { GetUserNotificationsDTO } from "../../application/interfaces/dto/GetUserNotificationsDTO";
import { IMarkAsAllReadUseCase } from "./../../domain/usecases/IMarkAllAsReadUseCase";
import { IGetUnreadCountUseCase } from "../../domain/usecases/IGetUnreadCountUseCase";
import { IGetUserNotificationsUseCase } from "../../domain/usecases/IGetUserNotificationsUseCase";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.IGetUserNotificationsUseCase)
    private readonly _getUserNotificationsUseCase: IGetUserNotificationsUseCase,
    @inject(TYPES.IGetUnreadCountUseCase)
    private readonly _getUnreadCountUseCase: IGetUnreadCountUseCase,
    @inject(TYPES.IMarkAsReadUseCase)
    private readonly _markAsReadUseCase: IMarkAsReadUseCase,
    @inject(TYPES.IMarkAsAllReadUseCase)
    private readonly _markAllAsReadUseCase: IMarkAsAllReadUseCase
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
  ): Promise<Response | any> => {
    try {
      const userId = req.headers["x-user-id"] as string;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const dto: GetUserNotificationsDTO = { userId, page, limit };

      const notifications = await this._getUserNotificationsUseCase.execute(
        dto
      );

      const unreadCount = await this._getUnreadCountUseCase.execute(userId);
      return res.json({ notifications, page, limit, unreadCount });
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
  ): Promise<Response| any> => {
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
  ): Promise<Response| any> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      await this._markAsReadUseCase.execute(userId);

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
  ): Promise<Response| any> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      await this._markAllAsReadUseCase.execute(userId);
      return res.json({ message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  };
}
