export interface IProcessPurchaseUseCase {
  execute(buyerId: string, sellerId: string, amount: number, artId: string): Promise<boolean>;
}
