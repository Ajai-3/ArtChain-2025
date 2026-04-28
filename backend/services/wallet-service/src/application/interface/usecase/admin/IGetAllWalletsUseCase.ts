import { GetAllWalletsResponse } from '../../../../types/WalletAdmin';

export interface IGetAllWalletsUseCase {
  execute(
    page: number,
    limit: number,
    filters?: {
      status?: 'active' | 'locked' | 'suspended';
      minBalance?: number;
      maxBalance?: number;
    },
    query?: string,
    token?: string
  ): Promise<GetAllWalletsResponse>;
}
