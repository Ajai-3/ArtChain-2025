export interface IGetArtStatsUseCase {
  execute(): Promise<{
    total: number;
    active: number;
    archived: number;
    deleted: number;
  }>;
}
