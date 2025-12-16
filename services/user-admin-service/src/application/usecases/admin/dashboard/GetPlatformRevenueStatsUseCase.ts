import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { IGetPlatformRevenueStatsUseCase, PlatformRevenueStats } from '../../../interface/usecase/admin/IGetPlatformRevenueStatsUseCase';
import { GetPlatformRevenueStatsDTO } from '../../../interface/dto/admin/GetPlatformRevenueStatsDTO';
import { IWalletService } from '../../../interface/http/IWalletService';

@injectable()
export class GetPlatformRevenueStatsUseCase implements IGetPlatformRevenueStatsUseCase {
  constructor(
    @inject(TYPES.IWalletService)
    private readonly _walletService: IWalletService
  ) {}

  async execute(dto: GetPlatformRevenueStatsDTO): Promise<PlatformRevenueStats> {
    // Fetch all admin transactions (commissions) from wallet service
    const { transactions } = await this._walletService.getAdminTransactions(
      dto.adminId,
      dto.startDate,
      dto.endDate
    );

    let totalRevenue = 0;
    const revenueBySource = {
      auctions: 0,
      artSales: 0,
    };
    const revenueByDateMap = new Map<string, number>();

    // Process each transaction and categorize by source
    for (const tx of transactions) {
      const amount = tx.amount;
      totalRevenue += amount;

      // Categorize based on description
      const desc = tx.description?.toLowerCase() || '';

      if (desc.includes('auction') || desc.includes('bid')) {
        revenueBySource.auctions += amount;
      } else {
        // Everything else is art sales commission
        revenueBySource.artSales += amount;
      }

      // Group by date
      const date = new Date(tx.createdAt).toISOString().split('T')[0];
      const current = revenueByDateMap.get(date) || 0;
      revenueByDateMap.set(date, current + amount);
    }

    // Convert map to object
    const revenueByDate: Record<string, number> = {};
    revenueByDateMap.forEach((value, key) => {
      revenueByDate[key] = value;
    });

    return {
      totalRevenue,
      revenueBySource,
      revenueByDate,
    };
  }
}
