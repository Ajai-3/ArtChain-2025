import { NextFunction, Request, Response } from "express";

export interface INotificationController {
  getUserNotifications(req: Request, res: Response, next: NextFunction): Promise<Response| void>;
  getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<Response| void>;
  markAsRead(req: Request, res: Response, next: NextFunction): Promise<Response| void>;
  markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<Response| void>;
}
