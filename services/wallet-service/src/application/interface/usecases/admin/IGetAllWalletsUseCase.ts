export interface IGetAllWalletsUseCase {
  execute(
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
  }>;
}
