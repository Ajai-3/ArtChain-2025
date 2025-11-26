import type { Report, ReportReason } from "../../../../../domain/entities/Report";

export interface IGetGroupedReportsUseCase {
  execute(
    page: number,
    limit: number,
    filters?: { status?: string; targetType?: string }
  ): Promise<{
    data: GroupedReport[];
    meta: { total: number; page: number; limit: number };
  }>;
}

export interface GroupedReport {
  targetId: string;
  targetType: string;
  reportCount: number;
  latestReportDate: Date;
  commonReason: ReportReason;
  status: string;
  reporters: Array<{
    id: string;
    username: string;
    email: string;
    profileImage: string | null;
  }>;
  reports: Report[];
}
