import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IAdminWalletRepository } from '../../../domain/repository/IAdminWalletRepository';
import { IGetAllWalletsUseCase } from '../../interface/usecase/admin/IGetAllWalletsUseCase';
import { UserServiceClient } from '../../../infrastructure/clients/UserServiceClient';
import { ElasticsearchClient } from '../../../infrastructure/clients/ElasticsearchClient';

@injectable()
export class GetAllWalletsUseCase implements IGetAllWalletsUseCase {
  constructor(
    @inject(TYPES.IAdminWalletRepository)
    private readonly _adminWalletRepository: IAdminWalletRepository,
    @inject(TYPES.UserServiceClient)
    private readonly _userServiceClient: UserServiceClient,
    @inject(TYPES.ElasticsearchClient)
    private readonly _elasticsearchClient: ElasticsearchClient
  ) {}

  async execute(
    page: number,
    limit: number,
    filters?: {
      status?: 'active' | 'locked' | 'suspended';
      minBalance?: number;
      maxBalance?: number;
    },
    query?: string,
    token?: string
  ): Promise<{
    data: any[];
    meta: { total: number; page: number; limit: number };
    stats?: {
        totalWallets: number;
        activeWallets: number;
        suspendedWallets: number;
        lockedWallets: number;
    };
  }> {
    let result;
    if (query && query.trim() !== '') {
       const userIds = await this._elasticsearchClient.searchUsers(query);
       
       if (userIds.length === 0) {
           return {
               data: [],
               meta: { total: 0, page, limit },
               stats: {
                   totalWallets: 0,
                   activeWallets: 0,
                   suspendedWallets: 0,
                   lockedWallets: 0
               }
           };
       }

       result = await this._adminWalletRepository.findWalletsByUserIds(
         userIds,
         page,
         limit,
         filters
       );
    } else {
       result = await this._adminWalletRepository.findAllWallets(
         page,
         limit,
         filters
       );
    }

    const userIds = result.data.map(wallet => wallet.userId);
    const users = await this._userServiceClient.getUsersByIds(userIds, token);
    const userMap = new Map(users.map(user => [user.id, user]));

    const enrichedData = result.data.map(wallet => {
      const user = userMap.get(wallet.userId);
      let walletUser = user;

      if (!walletUser && (wallet.userId === 'admin-platform-wallet-id' || wallet.userId === 'admin')) {
          walletUser = {
              id: wallet.userId,
              name: 'Platform Storage',
              username: 'System',
              email: 'admin@artchain.com',
              profileImage: null, 
          };
      }

      return {
        ...wallet,
        user: walletUser || {
          id: wallet.userId,
          name: 'Unknown User',
          username: 'unknown',
          email: 'N/A',
          profileImage: null,
        },
      };
    });

    const stats = result.stats ? {
        totalWallets: result.stats.total,
        activeWallets: result.stats.active,
        suspendedWallets: result.stats.suspended,
        lockedWallets: result.stats.locked
    } : undefined;

    return {
      data: enrichedData,
      meta: result.meta,
      stats: stats
    };
  }
}
