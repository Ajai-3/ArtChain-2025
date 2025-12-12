import type { Report } from "../../../../../domain/entities/Report";

export interface IUpdateReportStatusBulkUseCase {
  execute(targetId: string, targetType: string, status: 'resolved' | 'dismissed'): Promise<{ updated: number }>;
}
