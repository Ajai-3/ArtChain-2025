import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IWalletRepository } from '../../../domain/repository/IWalletRepository';
import { IGetAllWalletsUseCase } from '../../interface/usecase/admin/IGetAllWalletsUseCase';
import { UserServiceClient } from '../../../infrastructure/clients/UserServiceClient';
import { ElasticsearchClient } from '../../../infrastructure/clients/ElasticsearchClient';
import { GetAllWalletsResponse, WalletStats, UserBasicInfo } from '../../../types/WalletAdmin';
import { Wallet } from '../../../domain/entities/Wallet';

@injectable()
export class GetAllWalletsUseCase implements IGetAllWalletsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository,
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
  ): Promise<GetAllWalletsResponse> {
    let result;
    if (query && query.trim() !== '') {
       const userIds = await this._elasticsearchClient.searchUsers(query);
       
       if (userIds.length === 0) {
           const statsResult = await this._walletRepository.findAllWallets(1, 0, filters);
           
return {
                data: [],
                meta: { total: 0, page, limit },
                stats: statsResult.stats ? {
                    total: statsResult.stats.total,
                    active: statsResult.stats.active,
                    suspended: statsResult.stats.suspended,
                    locked: statsResult.stats.locked
                } : {
                    total: 0,
                    active: 0,
                    suspended: 0,
                    locked: 0
                }
            };
       }

       result = await this._walletRepository.findWalletsByUserIds(
         userIds,
         page,
         limit,
         filters
       );
    } else {
       result = await this._walletRepository.findAllWallets(
         page,
         limit,
         filters
       );
    }

    const userIds = result.data.map(wallet => wallet.userId);
    const users = await this._userServiceClient.getUsersByIds(userIds, token);
    const userMap = new Map(users.map(user => [user.id, user]));

    const enrichedData: (Wallet & { user: UserBasicInfo })[] = result.data.map(wallet => {
      const user = userMap.get(wallet.userId);

      return {
        ...wallet,
        quickStats: wallet.quickStats || {},
        transactionSummary: wallet.transactionSummary || {},
        user: user || {
          id: wallet.userId,
          name: 'Unknown User',
          username: 'unknown',
          email: 'N/A',
          profileImage: null,
        },
      };
    });

    const stats: WalletStats = {
        total: result.stats?.total ?? 0,
        active: result.stats?.active ?? 0,
        suspended: result.stats?.suspended ?? 0,
        locked: result.stats?.locked ?? 0
    };

    return {
      data: enrichedData,
      meta: result.meta,
      stats: stats
    };
  }
}
