export interface ICancelAuctionUseCase {
  execute(id: string): Promise<void>;
}
