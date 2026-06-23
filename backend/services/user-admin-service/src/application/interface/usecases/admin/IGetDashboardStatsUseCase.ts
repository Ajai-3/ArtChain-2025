
import { DashboardStatsResponse } from '../../../../types/responses/admin/DashboardStatsResponse';

export interface IGetDashboardStatsUseCase {
  execute(token: string): Promise<DashboardStatsResponse>;
}
