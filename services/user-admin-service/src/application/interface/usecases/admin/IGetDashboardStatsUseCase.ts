
export interface IGetDashboardStatsUseCase {
  execute(token: string): Promise<any>;
}
