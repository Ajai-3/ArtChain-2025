export interface IGetAuctionStatsUseCase {
  execute(): Promise<{
    total: number;
    active: number;
    scheduled: number;
    ended: number;
    cancelled: number;
  }>;
}
