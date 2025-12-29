import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IWalletRepository } from '../../../domain/repository/IWalletRepository';
import { IGetAdminTransactionsUseCase } from '../../interface/usecase/admin/IGetAdminTransactionsUseCase';
import { config } from '../../../infrastructure/config/env';
import { BadRequestError } from 'art-chain-shared';

@injectable()
export class GetAdminTransactionsUseCase implements IGetAdminTransactionsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(
    adminId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    const targetAdminId = adminId || config.platform_admin_id;
    if (!targetAdminId) {
      throw new BadRequestError("Admin ID not provided and PLATFORM_ADMIN_ID not configured");
    }
    return await this._walletRepository.getAdminTransactions(
      targetAdminId,
      startDate,
      endDate
    );
  }
}
