export interface IRefundCommissionFundsUseCase {
  execute(userId: string, commissionId: string, amount: number): Promise<boolean>;
}
