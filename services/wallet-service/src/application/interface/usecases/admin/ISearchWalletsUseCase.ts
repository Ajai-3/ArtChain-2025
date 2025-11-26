export interface ISearchWalletsUseCase {
  execute(
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
  }>;
}
