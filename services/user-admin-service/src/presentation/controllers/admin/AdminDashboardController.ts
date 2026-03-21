import { HttpStatus } from 'art-chain-shared';
import { logger } from '../../../utils/logger';
import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../../infrastructure/inversify/types';
import { ADMIN_MESSAGES } from '../../../constants/adminMessages';
import { IAdminDashboardController } from '../../interfaces/admin/IAdminDashboardController';
import { IGetDashboardStatsUseCase } from '../../../application/interface/usecases/admin/IGetDashboardStatsUseCase';
import { GetPlatformRevenueStatsDTO } from '../../../application/interface/dtos/admin/GetPlatformRevenueStatsDTO';
import { IGetPlatformRevenueStatsUseCase } from '../../../application/interface/usecases/admin/IGetPlatformRevenueStatsUseCase';

@injectable()
export class AdminDashboardController implements IAdminDashboardController {
  constructor(
    @inject(TYPES.IGetPlatformRevenueStatsUseCase)
    private readonly _getPlatformRevenueStatsUseCase: IGetPlatformRevenueStatsUseCase,
    @inject(TYPES.IGetDashboardStatsUseCase)
    private readonly _getDashboardStatsUseCase: IGetDashboardStatsUseCase
  ) {}

  //# ================================================================================================================
  //# ADMIN PLATFORM REVENUE STATS
  //# ================================================================================================================
  //# POST /api/v1/admin/revenue-stats
  //# Request body: { token: string }
  //# This controller allows admin to get platform revenue stats using their token.
  //# ================================================================================================================
  getPlatformRevenueStats = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const adminId = req.headers['x-admin-id'] as string;
      const timeRange = (req.query.timeRange as string) || '7d';
      let startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      const token = req.headers.authorization?.split(' ')[1] || '';

      if (!startDate && timeRange !== 'all') {
        startDate = new Date();
        if (timeRange === 'today') startDate.setHours(0, 0, 0, 0);
        else if (timeRange === '7d') startDate.setDate(endDate.getDate() - 7);
        else if (timeRange === '30d') startDate.setDate(endDate.getDate() - 30);
        else startDate.setDate(endDate.getDate() - 7); 
      }

      const dto: GetPlatformRevenueStatsDTO = {
        adminId,
        startDate,
        endDate,
        token
      };

      const stats = await this._getPlatformRevenueStatsUseCase.execute(dto);

      res.status(HttpStatus.OK).json({
        message: ADMIN_MESSAGES.REVENUE_STATS_SUCCESS,
        data: stats,
      });
    } catch (error) {
      logger.error('Error in getPlatformRevenueStats:', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# ADMIN DASHBOARD STATS
  //# ================================================================================================================
  //# POST /api/v1/admin/dashboard-stats
  //# Request body: { token: string }
  //# This controller allows admin to get dashboard stats using their token.
  //# ================================================================================================================
  getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1] || '';

      const stats = await this._getDashboardStatsUseCase.execute(token);

      return res.status(HttpStatus.OK).json({
        message: ADMIN_MESSAGES.DASHBOARD_STATS_SUCCESS,
        data: stats,
      });
    } catch (error) {
      logger.error('Error in getDashboardStats:', error);
      next(error);
    }
  };
}
