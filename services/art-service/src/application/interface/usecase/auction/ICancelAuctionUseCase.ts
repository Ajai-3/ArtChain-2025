export interface ICancelAuctionUseCase {
  execute(id: string, userId: string): Promise<void>;
}
