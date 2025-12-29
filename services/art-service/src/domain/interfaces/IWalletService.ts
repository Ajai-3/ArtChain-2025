export interface IWalletService {
  processSplitPurchase(
    buyerId: string,
    sellerId: string,
    totalAmount: number,
    commissionAmount: number,
    artId: string
  ): Promise<boolean>;
  lockFunds(userId: string, amount: number, auctionId: string): Promise<boolean>;
  unlockFunds(userId: string, amount: number, auctionId: string): Promise<boolean>;
  settleAuction(
    winnerId: string,
    sellerId: string,
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
  distributeCommissionFunds(params: {
    userId: string;
    artistId: string;
    commissionId: string;
    totalAmount: number;
    artistAmount: number;
    platformFee: number;
  }): Promise<boolean>;
  refundCommissionFunds(params: {
    userId: string;
    commissionId: string;
    amount: number;
  }): Promise<boolean>;
}
