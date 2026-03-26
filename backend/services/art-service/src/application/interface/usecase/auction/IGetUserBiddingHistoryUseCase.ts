export interface IGetUserBiddingHistoryUseCase {
  execute(userId: string, page?: number, limit?: number, status?: string): Promise<any[]>;
}