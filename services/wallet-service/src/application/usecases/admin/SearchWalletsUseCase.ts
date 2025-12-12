import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IAdminWalletRepository } from '../../../domain/repository/IAdminWalletRepository';
import { ISearchWalletsUseCase } from '../../interface/usecases/admin/ISearchWalletsUseCase';
import { ElasticsearchClient } from '../../../infrastructure/clients/ElasticsearchClient';
import { UserServiceClient } from '../../../infrastructure/clients/UserServiceClient';

@injectable()
export class SearchWalletsUseCase implements ISearchWalletsUseCase {
  constructor(
    @inject(TYPES.IAdminWalletRepository)
    private readonly _adminWalletRepository: IAdminWalletRepository,
    @inject(TYPES.ElasticsearchClient)
    private readonly _elasticsearchClient: ElasticsearchClient,
    @inject(TYPES.UserServiceClient)
    private readonly _userServiceClient: UserServiceClient
  ) {}

  async execute(
    query: string,
    page: number,
    limit: number,
    filters?: {
      status?: 'active' | 'locked' | 'suspended';
      minBalance?: number;
      maxBalance?: number;
    }
  ): Promise<{
    data: any[];
    meta: { total: number; page: number; limit: number };
  }> {
    // If no query, return all wallets
    if (!query || query.trim() === '') {
      return this.getAllWallets(page, limit, filters);
    }

    // Search users in Elasticsearch
    const userIds = await this._elasticsearchClient.searchUsers(query);

    // If no users found, return empty result
    if (userIds.length === 0) {
      return {
        data: [],
        meta: { total: 0, page, limit },
      };
    }

    // Get wallets for those user IDs
    const result = await this._adminWalletRepository.findWalletsByUserIds(
      userIds,
      page,
      limit,
      filters
    );

    // Fetch user profiles
    const users = await this._userServiceClient.getUsersByIds(
      result.data.map(w => w.userId)
    );

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

  private async getAllWallets(
    page: number,
    limit: number,
    filters?: any
  ): Promise<any> {
    const result = await this._adminWalletRepository.findAllWallets(
      page,
      limit,
      filters
    );

    const userIds = result.data.map(wallet => wallet.userId);
    const users = await this._userServiceClient.getUsersByIds(userIds);
    const userMap = new Map(users.map(user => [user.id, user]));

    const enrichedData = result.data.map(wallet => ({
      ...wallet,
      user: userMap.get(wallet.userId) || {
        id: wallet.userId,
        name: 'Unknown User',
        username: 'unknown',
        email: 'N/A',
        profileImage: null,
      },
    }));

    return {
      data: enrichedData,
      meta: result.meta,
    };
  }
}
