import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IWalletRepository } from '../../../domain/repository/IWalletRepository';

@injectable()
export class TransferLockedCommissionFundsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(params: {
    fromUserId: string;
    toUserId: string;
    commissionId: string;
    amount: number;
  }): Promise<boolean> {
    return this._walletRepository.transferLockedCommissionFunds(params);
  }
}
