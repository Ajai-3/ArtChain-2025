import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IWalletRepository, RecentTransaction } from '../../../domain/repository/IWalletRepository';
import { IGetAllRecentTransactionsUseCase } from '../../interface/usecase/admin/IGetAllRecentTransactionsUseCase';

@injectable()
export class GetAllRecentTransactionsUseCase implements IGetAllRecentTransactionsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(limit: number): Promise<RecentTransaction[]> {
    return this._walletRepository.getAllRecentTransactions(limit);
  }
}
