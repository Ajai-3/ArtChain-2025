import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IWalletRepository } from '../../../domain/repository/IWalletRepository';
import { IUpdateWalletStatusUseCase } from '../../interface/usecase/admin/IUpdateWalletStatusUseCase';
import { Wallet } from '../../../domain/entities/Wallet';

@injectable()
export class UpdateWalletStatusUseCase implements IUpdateWalletStatusUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(
    walletId: string,
    status: 'active' | 'locked' | 'suspended'
  ): Promise<Wallet> {
    return await this._walletRepository.updateWalletStatus(walletId, status);
  }
}
