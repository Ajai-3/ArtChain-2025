export interface IGetAuctionStatsUseCase {
  execute(timeRange?: string): Promise<{
    active: number;
    scheduled: number;
    ended: number;
    sold: number;
    unsold: number;
  }>;
}
