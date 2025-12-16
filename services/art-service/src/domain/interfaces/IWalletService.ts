export interface IWalletService {
  processPurchase(
    buyerId: string,
    sellerId: string,
    amount: number,
    artId: string
  ): Promise<boolean>;
  lockFunds(userId: string, amount: number, auctionId: string): Promise<boolean>;
  unlockFunds(userId: string, amount: number, auctionId: string): Promise<boolean>;
  settleAuction(
    winnerId: string,
    sellerId: string,
    adminId: string,
    totalAmount: number,
    commissionAmount: number,
    auctionId: string
  ): Promise<boolean>;

  processPayment(
    payerId: string,
    payeeId: string,
    amount: number,
    description: string,
    referenceId: string,
    category: string
  ): Promise<boolean>;
}
