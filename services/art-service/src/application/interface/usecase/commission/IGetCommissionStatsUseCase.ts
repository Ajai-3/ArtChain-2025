export interface IGetCommissionStatsUseCase {
  execute(timeRange?: string): Promise<{
    REQUESTED: number;
    NEGOTIATING: number;
    AGREED: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    CANCELLED: number;
    REJECTED: number;
    totalRevenue: number;
    activeDisputes: number;
    totalRequests: number;
    completedRequests: number;
    inProgressRequests: number;
    currentCommissionPercentage: number;
  }>;
}
