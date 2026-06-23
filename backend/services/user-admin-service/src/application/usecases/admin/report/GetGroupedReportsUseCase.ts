import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { IReportRepository } from '../../../../domain/repositories/user/IReportRepository';
import {
  Report,
  ReportReason,
  ReportStatus,
} from '../../../../domain/entities/Report';
import {
  IGetGroupedReportsUseCase,
  GroupedReportResponse,
} from '../../../interface/usecases/admin/report/IGetGroupedReportsUseCase';
import {
  GroupedReportsResponse,
  ReporterInfo,
} from '../../../../types/responses/admin/GroupedReportsResponse';

interface ReportWithReporter extends Report {
  reporter?: ReporterInfo;
}

@injectable()
export class GetGroupedReportsUseCase implements IGetGroupedReportsUseCase {
  constructor(
    @inject(TYPES.IReportRepository)
    private readonly _reportRepository: IReportRepository,
  ) {}

  async execute(
    page: number,
    limit: number,
    filters?: { status?: string; targetType?: string },
  ): Promise<GroupedReportsResponse> {
    // Get all reports with filters
    const allReportsResult = await this._reportRepository.findAll(
      1,
      10000,
      filters,
    );
    const allReports = allReportsResult.data as unknown as ReportWithReporter[];

    const groupedMap = new Map<string, GroupedReportResponse>();

    for (const report of allReports) {
      const key = `${report.targetId}-${report.targetType}`;

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          targetId: report.targetId,
          targetType: report.targetType,
          reportCount: 0,
          latestReportDate: report.createdAt,
          commonReason: report.reason,
          status: 'pending' as ReportStatus,
          reporters: [],
          reports: [],
        });
      }

      const group = groupedMap.get(key)!;
      group.reportCount++;
      group.reports.push(report);

      // Update latest date
      if (new Date(report.createdAt) > new Date(group.latestReportDate)) {
        group.latestReportDate = report.createdAt;
      }

      // Add reporter if not already in list (repository includes reporter object)
      if (
        report.reporter &&
        !group.reporters.find((r) => r.id === report.reporter!.id)
      ) {
        group.reporters.push({
          id: report.reporter.id,
          username: report.reporter.username,
          email: report.reporter.email,
          profileImage: report.reporter.profileImage,
        });
      }
    }

    // Convert map to array and sort by report count (descending)
    let groupedArray = Array.from(groupedMap.values());

    // Calculate status for each group AFTER all reports are collected
    groupedArray = groupedArray.map((group) => {
      const statuses = group.reports.map((r) => r.status);
      const hasPending = statuses.some((s) => s === 'pending');
      const allResolved = statuses.every((s) => s === 'resolved');
      const allDismissed = statuses.every((s) => s === 'dismissed');

      let groupStatus: ReportStatus = 'pending';
      if (!hasPending) {
        if (allResolved) {
          groupStatus = 'resolved';
        } else if (allDismissed) {
          groupStatus = 'dismissed';
        } else {
          groupStatus = 'resolved';
        }
      }

      return { ...group, status: groupStatus };
    });

    groupedArray.sort((a, b) => b.reportCount - a.reportCount);

    // Calculate most common reason for each group
    groupedArray = groupedArray.map((group) => {
      const reasonCounts = new Map<string, number>();
      group.reports.forEach((report) => {
        reasonCounts.set(
          report.reason,
          (reasonCounts.get(report.reason) || 0) + 1,
        );
      });

      let maxCount = 0;
      let commonReason: ReportReason = group.reports[0]?.reason || 'other';
      reasonCounts.forEach((count, reason) => {
        if (count > maxCount) {
          maxCount = count;
          commonReason = reason as ReportReason;
        }
      });

      return { ...group, commonReason };
    });

    // Pagination
    const total = groupedArray.length;
    const skip = (page - 1) * limit;
    const paginatedData = groupedArray.slice(
      skip,
      skip + limit,
    ) as GroupedReportResponse[];

    return {
      data: paginatedData,
      meta: {
        total,
        page,
        limit,
      },
    };
  }
}
