export interface IWalletService {
  processPurchase(
    buyerId: string,
    sellerId: string,
    amount: number,
    artId: string
  ): Promise<boolean>;
  lockFunds(userId: string, amount: number, auctionId: string): Promise<boolean>;
  unlockFunds(userId: string, amount: number, auctionId: string): Promise<boolean>;
}
