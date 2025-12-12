import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IAdminWalletRepository, TransactionFilters } from '../../../domain/repository/IAdminWalletRepository';
import { IGetUserTransactionsUseCase } from '../../interface/usecases/admin/IGetUserTransactionsUseCase';
import { Transaction } from '../../../domain/entities/Transaction';

@injectable()
export class GetUserTransactionsUseCase implements IGetUserTransactionsUseCase {
  constructor(
    @inject(TYPES.IAdminWalletRepository)
    private readonly _adminWalletRepository: IAdminWalletRepository
  ) {}

  async execute(
    walletId: string,
    page: number,
    limit: number,
    filters?: {
      type?: 'credited' | 'debited';
      category?: 'TOP_UP' | 'SALE' | 'PURCHASE' | 'WITHDRAWAL' | 'COMMISSION' | 'REFUND' | 'OTHER';
      status?: 'pending' | 'success' | 'failed';
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<{
    data: Transaction[];
    meta: { total: number; page: number; limit: number };
  }> {
    return await this._adminWalletRepository.getTransactionsByWalletId(
      walletId,
      page,
      limit,
      filters as TransactionFilters
    );
  }
}
