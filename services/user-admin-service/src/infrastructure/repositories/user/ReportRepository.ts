import { injectable } from 'inversify';
import { prisma } from '../../db/prisma';
import { BaseRepositoryImpl } from '../BaseRepositoryImpl';
import { Report } from '../../../domain/entities/Report';
import { IReportRepository } from '../../../domain/repositories/user/IReportRepository';
import { config } from '../../config/env';

@injectable()
export class ReportRepository implements IReportRepository {
  protected model = prisma.report;

  protected toSafe(entity: any): Report {
    return entity as unknown as Report;
  }

  async create(data: Partial<Report>): Promise<Report> {
    const res = await this.model.create({ data });
    return this.toSafe(res);
  }

  async update(id: string, data: Partial<Report>): Promise<Report> {
    const res = await this.model.update({ where: { id }, data });
    return this.toSafe(res);
  }

  async delete(id: string): Promise<boolean> {
    await this.model.delete({ where: { id } });
    return true;
  }

  async findById(id: string): Promise<Report | null> {
    const res = await this.model.findUnique({ where: { id } });
    return res ? this.toSafe(res) : null;
  }

  async findByReporterId(reporterId: string): Promise<Report[]> {
    const reports = await this.model.findMany({ where: { reporterId } });
    return reports as unknown as Report[];
  }

  async findByReporterAndTarget(
    reporterId: string,
    targetId: string,
    targetType: string
  ): Promise<Report | null> {
    const report = await this.model.findFirst({
      where: {
        reporterId,
        targetId,
        targetType: targetType.toUpperCase() as any,
      },
    });
    return report ? this.toSafe(report) : null;
  }

  async updateBulkByTarget(
    targetId: string,
    targetType: string,
    status: string
  ): Promise<number> {
    const result = await this.model.updateMany({
      where: {
        targetId,
        targetType: targetType.toUpperCase() as any,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    return result.count;
  }

  async findAll(
    page: number,
    limit: number,
    filters?: { status?: string; targetType?: string }
  ): Promise<{ data: Report[]; meta: { total: number; page: number; limit: number } }> {
    const where: any = {};
    if (filters?.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }
    if (filters?.targetType && filters.targetType !== 'ALL') {
      where.targetType = filters.targetType;
    }

    const skip = (page - 1) * limit;

    const [total, reports] = await Promise.all([
      this.model.count({ where }),
      this.model.findMany({
        where,
        include: {
          reporter: {
            select: {
              id: true,
              username: true,
              email: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
    ]);

    // Add domain to profile images
    const CDN = config.aws_cdn_domain
    const transformedReports = reports.map((report: any) => ({
      ...report,
      reporter: report.reporter ? {
        ...report.reporter,
        profileImage: report.reporter.profileImage 
          ? `${CDN}/${report.reporter.profileImage}`
          : null
      } : null
    }));

    return {
      data: transformedReports as unknown as Report[],
      meta: {
        total,
        page,
        limit,
      },
    };
  }
}
