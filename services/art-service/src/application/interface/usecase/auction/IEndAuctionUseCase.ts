export interface IEndAuctionUseCase {
  execute(auctionId: string): Promise<boolean>;
}
