import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IWalletRepository, TransactionFilters } from '../../../domain/repository/IWalletRepository';
import { IGetUserTransactionsUseCase } from '../../interface/usecase/admin/IGetUserTransactionsUseCase';
import { Transaction } from '../../../domain/entities/Transaction';

@injectable()
export class GetUserTransactionsUseCase implements IGetUserTransactionsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
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
    return await this._walletRepository.getTransactionsByWalletId(
      walletId,
      page,
      limit,
      filters as TransactionFilters
    );
  }
}
