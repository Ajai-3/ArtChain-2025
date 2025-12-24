import { Request, Response } from 'express';

export interface IAdminDashboardController {
  getPlatformRevenueStats(req: Request, res: Response): Promise<void>;
  getDashboardStats(req: Request, res: Response): Promise<void>;
}
