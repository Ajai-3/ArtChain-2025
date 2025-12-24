import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IAdminWalletRepository } from '../../../domain/repository/IAdminWalletRepository';
import { IUpdateWalletStatusUseCase } from '../../interface/usecase/admin/IUpdateWalletStatusUseCase';
import { Wallet } from '../../../domain/entities/Wallet';

@injectable()
export class UpdateWalletStatusUseCase implements IUpdateWalletStatusUseCase {
  constructor(
    @inject(TYPES.IAdminWalletRepository)
    private readonly _adminWalletRepository: IAdminWalletRepository
  ) {}

  async execute(
    walletId: string,
    status: 'active' | 'locked' | 'suspended'
  ): Promise<Wallet> {
    return await this._adminWalletRepository.updateWalletStatus(walletId, status);
  }
}
