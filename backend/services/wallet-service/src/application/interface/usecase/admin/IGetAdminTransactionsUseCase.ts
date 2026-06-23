import { AdminTransaction } from '../../../../domain/repository/IWalletRepository';

export interface IGetAdminTransactionsUseCase {
  execute(
    adminId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<AdminTransaction[]>;
}
