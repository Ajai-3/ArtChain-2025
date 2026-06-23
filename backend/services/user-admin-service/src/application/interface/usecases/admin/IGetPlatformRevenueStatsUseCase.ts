import { GetPlatformRevenueStatsDTO } from '../../dtos/admin/GetPlatformRevenueStatsDTO';
import { RevenueStatsResponse } from '../../../../types/responses/admin/RevenueStatsResponse';

export interface IGetPlatformRevenueStatsUseCase {
  execute(dto: GetPlatformRevenueStatsDTO): Promise<RevenueStatsResponse>;
}
