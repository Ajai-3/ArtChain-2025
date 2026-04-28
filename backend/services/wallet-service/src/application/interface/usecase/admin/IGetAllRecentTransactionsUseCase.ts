import { RecentTransaction } from '../../../../domain/repository/IWalletRepository';

export interface IGetAllRecentTransactionsUseCase {
  execute(limit: number): Promise<RecentTransaction[]>;
}
