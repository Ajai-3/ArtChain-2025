export interface IGetAuctionStatsUseCase {
  execute(timeRange?: string): Promise<{
    active: number;
    ended: number;
    sold: number;
    unsold: number;
  }>;
}
