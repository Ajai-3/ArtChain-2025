import type { Report } from '../../../../../domain/entities/Report';

export interface IUpdateReportStatusBulkUseCase {
  execute(targetId: string, targetType: string, status: 'resolved' | 'dismissed', token?: string): Promise<{ updated: number }>;
}
