export interface IGetAdminTransactionsUseCase {
  execute(
    adminId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]>;
}
