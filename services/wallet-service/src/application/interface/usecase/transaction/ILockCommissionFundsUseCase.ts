export interface ILockCommissionFundsUseCase {
  execute(userId: string, commissionId: string, amount: number): Promise<boolean>;
}
