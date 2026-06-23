import { GetRevenueStatsDTO } from '../../dto/wallet/GetRevenueStatsDTO';
import { RevenueStatsResponse } from '../../../../types/Revenue';

export interface IGetRevenueStatsUseCase {
  execute(dto: GetRevenueStatsDTO): Promise<RevenueStatsResponse>;
}
