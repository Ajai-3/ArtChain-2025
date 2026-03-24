export interface IGetSalesAnalyticsUseCase {
  execute(userId: string, range: string): Promise<{ date: string; totalAmount: number; count: number }[]>;
}