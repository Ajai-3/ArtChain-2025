import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { IGetPlatformRevenueStatsUseCase, PlatformRevenueStats } from '../../../interface/usecases/admin/IGetPlatformRevenueStatsUseCase';
import { GetPlatformRevenueStatsDTO } from '../../../interface/dtos/admin/GetPlatformRevenueStatsDTO';
import { IWalletService } from '../../../interface/http/IWalletService';

@injectable()
export class GetPlatformRevenueStatsUseCase implements IGetPlatformRevenueStatsUseCase {
  constructor(
    @inject(TYPES.IWalletService)
    private readonly _walletService: IWalletService
  ) {}

  async execute(dto: GetPlatformRevenueStatsDTO): Promise<PlatformRevenueStats> {
    const stats = await this._walletService.getRevenueStats(
      dto.adminId,
      dto.token,
      dto.startDate,
      dto.endDate
    );

    if (!stats) {
      return {
        totalRevenue: 0,
        revenueBySource: { 
          auctions: { amount: 0, count: 0 }, 
          artSales: { amount: 0, count: 0 }, 
          commissions: { amount: 0, count: 0 } 
        },
        revenueByDate: {}
      };
    }

    // Map the chartData array back to the Record type if needed
    const revenueByDate: Record<string, number> = {};
    if (stats.chartData && Array.isArray(stats.chartData)) {
      stats.chartData.forEach((item: any) => {
        revenueByDate[item.date] = item.revenue;
      });
    }

    return {
      totalRevenue: stats.totalRevenue,
      revenueBySource: {
        auctions: stats.breakdown.auctions,
        artSales: stats.breakdown.artSales,
        commissions: stats.breakdown.commissions
      },
      revenueByDate
    };
  }
}
