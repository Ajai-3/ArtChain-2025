import { Report } from '../../../../../domain/entities/Report';

export interface IGetAllReportsUseCase {
  execute(page: number, limit: number, filters?: { status?: string; targetType?: string }): Promise<{ data: Report[]; meta: { total: number; page: number; limit: number } }>;
}
