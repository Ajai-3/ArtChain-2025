import { Report } from '../../entities/Report';
import { IBaseRepository } from '../IBaseRepository';

export interface IReportRepository {
  create(data: Partial<Report>): Promise<Report>;
  update(id: string, data: Partial<Report>): Promise<Report>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<Report | null>;
  findByReporterId(reporterId: string): Promise<Report[]>;
  findByReporterAndTarget(reporterId: string, targetId: string, targetType: string): Promise<Report | null>;
  updateBulkByTarget(targetId: string, targetType: string, status: string): Promise<number>;
  findAll(page: number, limit: number, filters?: { status?: string; targetType?: string }): Promise<{ data: Report[]; meta: { total: number; page: number; limit: number } }>;
}
