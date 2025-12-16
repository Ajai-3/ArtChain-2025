import { GetRevenueStatsDTO } from "../../dto/wallet/GetRevenueStatsDTO";

export interface IGetRevenueStatsUseCase {
  execute(dto: GetRevenueStatsDTO): Promise<any>;
}
