export interface IGetArtStatsUseCase {
  execute(): Promise<{
    total: number;
    free: number;
    premium: number;
    aiGenerated: number;
  }>;
}
