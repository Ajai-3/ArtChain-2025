import { Request, Response, NextFunction } from "express";
import { INotificationController } from "../interface/INotificationController";
import { NotificationRepositoryImp } from "../../infrastructure/repositories/NotificationRepositoryImp";
import { GetUserNotificationsUseCase } from "../../application/usecases/GetUserNotificationsUseCase";
import { GetUnreadCountUseCase } from "../../application/usecases/GetUnreadCountUseCase";
import { MarkAsReadUseCase } from "../../application/usecases/MarkAsReadUseCase";
import { MarkAllAsReadUseCase } from "../../application/usecases/MarkAllAsReadUseCase";

const repo = new NotificationRepositoryImp();

export class NotificationController implements INotificationController {
  constructor(
    private readonly _getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private readonly _getUnreadCountUseCase: GetUnreadCountUseCase,
    private readonly _markAsReadUseCase: MarkAsReadUseCase,
    private readonly _markAllAsReadUseCase: MarkAllAsReadUseCase
  ) {}

  getUserNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const notifications = await this._getUserNotificationsUseCase.execute(userId);
      return res.json({ notifications });
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const count = await this._getUnreadCountUseCase.execute(userId);
      return res.json({ unreadCount: count });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      await this._markAsReadUseCase.execute(id);
      return res.json({ message: "Notification marked as read" });
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      await this._markAllAsReadUseCase.execute(userId);
      return res.json({ message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  };
}
