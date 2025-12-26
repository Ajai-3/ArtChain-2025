import { GetPlatformRevenueStatsDTO } from "../../dtos/admin/GetPlatformRevenueStatsDTO";

export interface PlatformRevenueStats {
  totalRevenue: number;
  revenueBySource: {
    auctions: { amount: number; count: number };
    artSales: { amount: number; count: number };
    commissions: { amount: number; count: number };
  };
  revenueByDate: Record<string, number>;
}

export interface IGetPlatformRevenueStatsUseCase {
  execute(dto: GetPlatformRevenueStatsDTO): Promise<PlatformRevenueStats>;
}
