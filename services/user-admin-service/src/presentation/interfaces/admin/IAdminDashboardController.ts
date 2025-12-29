import { Request, Response, NextFunction } from 'express';

export interface IAdminDashboardController {
  getPlatformRevenueStats: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getDashboardStats: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}
