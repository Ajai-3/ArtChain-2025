import { NextFunction, Request, Response } from "express";

export interface INotificationController {
  getUserNotifications: (req: Request, res: Response, next: NextFunction) => Promise<Response | any>;
  getUnreadCount: (req: Request, res: Response, next: NextFunction) => Promise<Response | any>;
  markAsRead: (req: Request, res: Response, next: NextFunction) => Promise<Response | any>;
  markAllAsRead: (req: Request, res: Response, next: NextFunction) => Promise<Response | any>;
}
