import { ReportReason, ReportStatus, ReportTargetType } from '../../../domain/entities/Report';

export interface GroupedReportsResponse {
  data: GroupedReportResponse[];
  meta: PaginationMeta;
}

export interface GroupedReportResponse {
  targetId: string;
  targetType: ReportTargetType;
  reportCount: number;
  latestReportDate: Date;
  commonReason: ReportReason;
  status: ReportStatus;
  reporters: ReporterInfo[];
  reports: ReportWithReporterResponse[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export interface ReportWithReporterResponse {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: ReportTargetType;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  reporter?: ReporterInfo;
}

export interface ReporterInfo {
  id: string;
  username: string;
  email: string;
  profileImage: string | null;
}