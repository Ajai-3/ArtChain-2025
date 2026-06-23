import { AdminTransactionStatsResponse } from '../../../../types/TransactionStats';

export interface IGetTransactionStatsUseCase {
  execute(timeRange: string): Promise<AdminTransactionStatsResponse>;
}
