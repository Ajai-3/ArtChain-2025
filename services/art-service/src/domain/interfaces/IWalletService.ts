export interface IWalletService {
  processPurchase(
    buyerId: string,
    sellerId: string,
    amount: number,
    artId: string
  ): Promise<boolean>;
}
