export interface IGetTransactionStatsUseCase {
  execute(timeRange: string): Promise<any>;
}
