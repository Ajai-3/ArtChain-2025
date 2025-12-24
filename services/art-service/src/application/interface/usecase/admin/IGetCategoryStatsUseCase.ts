
export interface IGetCategoryStatsUseCase {
  execute(): Promise<{ category: string; count: number }[]>;
}
