export interface IRefundCommissionFundsUseCase {
  execute(userId: string, artistId: string, commissionId: string, amount: number): Promise<boolean>;
}
