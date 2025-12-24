
export interface IGetAllRecentTransactionsUseCase {
  execute(limit: number): Promise<any[]>;
}
