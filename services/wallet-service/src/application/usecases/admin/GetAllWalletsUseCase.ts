import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IAdminWalletRepository } from '../../../domain/repository/IAdminWalletRepository';
import { IGetAllWalletsUseCase } from '../../interface/usecases/admin/IGetAllWalletsUseCase';
import { UserServiceClient } from '../../../infrastructure/clients/UserServiceClient';

@injectable()
export class GetAllWalletsUseCase implements IGetAllWalletsUseCase {
  constructor(
    @inject(TYPES.IAdminWalletRepository)
    private readonly _adminWalletRepository: IAdminWalletRepository,
    @inject(TYPES.UserServiceClient)
    private readonly _userServiceClient: UserServiceClient
  ) {}

  async execute(
    page: number,
    limit: number,
    filters?: {
      status?: 'active' | 'locked' | 'suspended';
      minBalance?: number;
      maxBalance?: number;
    },
    token?: string
  ): Promise<{
    data: any[];
    meta: { total: number; page: number; limit: number };
  }> {
    // Get wallets from repository
    const result = await this._adminWalletRepository.findAllWallets(
      page,
      limit,
      filters
    );

    // Extract user IDs
    const userIds = result.data.map(wallet => wallet.userId);

    // Fetch user profiles
    const users = await this._userServiceClient.getUsersByIds(userIds, token);

    // Create a map for quick lookup
    const userMap = new Map(users.map(user => [user.id, user]));

    // Enrich wallet data with user profiles
    const enrichedData = result.data.map(wallet => {
      const user = userMap.get(wallet.userId);
      return {
        ...wallet,
        user: user || {
          id: wallet.userId,
          name: 'Unknown User',
          username: 'unknown',
          email: 'N/A',
          profileImage: null,
        },
      };
    });

    return {
      data: enrichedData,
      meta: result.meta,
    };
  }
}
