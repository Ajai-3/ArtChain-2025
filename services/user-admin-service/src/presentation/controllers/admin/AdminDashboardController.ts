import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IAdminDashboardController } from '../../interfaces/admin/IAdminDashboardController';
import { IGetPlatformRevenueStatsUseCase } from '../../../application/interface/usecase/admin/IGetPlatformRevenueStatsUseCase';
import { GetPlatformRevenueStatsDTO } from '../../../application/interface/dto/admin/GetPlatformRevenueStatsDTO';
import { HttpStatus } from 'art-chain-shared';

@injectable()
export class AdminDashboardController implements IAdminDashboardController {
  constructor(
    @inject(TYPES.IGetPlatformRevenueStatsUseCase)
    private readonly _getPlatformRevenueStatsUseCase: IGetPlatformRevenueStatsUseCase
  ) {}

  getPlatformRevenueStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = req.headers['x-admin-id'] as string;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      if (!adminId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Admin ID is required in headers',
        });
        return;
      }

      const dto: GetPlatformRevenueStatsDTO = {
        adminId,
        startDate,
        endDate,
      };

      const stats = await this._getPlatformRevenueStatsUseCase.execute(dto);

      res.status(HttpStatus.OK).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Error in getPlatformRevenueStats:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to fetch platform revenue stats',
      });
    }
  };
}
