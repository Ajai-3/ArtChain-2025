export interface IGetAIAnalyticsUseCase {
  execute(): Promise<{
    totalGenerations: number;
    activeModels: number;
  }>;
}
