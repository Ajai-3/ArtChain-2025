import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IAdminDashboardController } from '../../interfaces/admin/IAdminDashboardController';
import { IGetPlatformRevenueStatsUseCase } from '../../../application/interface/usecases/admin/IGetPlatformRevenueStatsUseCase';
import { IGetDashboardStatsUseCase } from '../../../application/interface/usecases/admin/IGetDashboardStatsUseCase';
import { GetPlatformRevenueStatsDTO } from '../../../application/interface/dtos/admin/GetPlatformRevenueStatsDTO';
import { HttpStatus } from 'art-chain-shared';
import { logger } from '../../../utils/logger';

@injectable()
export class AdminDashboardController implements IAdminDashboardController {
  constructor(
    @inject(TYPES.IGetPlatformRevenueStatsUseCase)
    private readonly _getPlatformRevenueStatsUseCase: IGetPlatformRevenueStatsUseCase,
    @inject(TYPES.IGetDashboardStatsUseCase)
    private readonly _getDashboardStatsUseCase: IGetDashboardStatsUseCase
  ) {}

  getPlatformRevenueStats = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const adminId = req.headers['x-admin-id'] as string;
      const timeRange = (req.query.timeRange as string) || '7d';
      let startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      const token = req.headers.authorization?.split(' ')[1] || "";

      if (!startDate && timeRange !== 'all') {
        startDate = new Date();
        if (timeRange === 'today') startDate.setHours(0, 0, 0, 0);
        else if (timeRange === '7d') startDate.setDate(endDate.getDate() - 7);
        else if (timeRange === '30d') startDate.setDate(endDate.getDate() - 30);
        else startDate.setDate(endDate.getDate() - 7); // Default
      }

      const dto: GetPlatformRevenueStatsDTO = {
        adminId,
        startDate,
        endDate,
        token
      };

      const stats = await this._getPlatformRevenueStatsUseCase.execute(dto);

      res.status(HttpStatus.OK).json({
        data: stats,
      });
    } catch (error) {
      logger.error('Error in getPlatformRevenueStats:', error);
      next(error)
    }
  };

  getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1] || "";

      const stats = await this._getDashboardStatsUseCase.execute(token);

      return res.status(HttpStatus.OK).json({
        data: stats,
      });
    } catch (error) {
      logger.error('Error in getDashboardStats:', error);
      next(error)
    }
  };
}
