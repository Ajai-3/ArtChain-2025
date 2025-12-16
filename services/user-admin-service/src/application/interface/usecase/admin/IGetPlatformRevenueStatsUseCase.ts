import { GetPlatformRevenueStatsDTO } from "../dto/admin/GetPlatformRevenueStatsDTO";

export interface PlatformRevenueStats {
  totalRevenue: number;
  revenueBySource: {
    auctions: number;
    artSales: number;
  };
  revenueByDate: Record<string, number>;
}

export interface IGetPlatformRevenueStatsUseCase {
  execute(dto: GetPlatformRevenueStatsDTO): Promise<PlatformRevenueStats>;
}
