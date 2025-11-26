import { injectable } from 'inversify';
import { prisma } from '../../db/prisma';
import { BaseRepositoryImpl } from '../BaseRepositoryImpl';
import { Report } from '../../../domain/entities/Report';
import { IReportRepository } from '../../../domain/repositories/user/IReportRepository';

@injectable()
export class ReportRepository extends BaseRepositoryImpl<Report> implements IReportRepository {
  protected model = prisma.report;

  async findByReporterId(reporterId: string): Promise<Report[]> {
    const reports = await this.model.findMany({ where: { reporterId } });
    return reports as unknown as Report[];
  }
}
