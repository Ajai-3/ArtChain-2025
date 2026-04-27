import { GroupedReportsResponse } from '../../../../../types/responses/admin/GroupedReportsResponse';

export type { GroupedReportResponse, ReporterInfo, ReportWithReporterResponse } from '../../../../../types/responses/admin/GroupedReportsResponse';

export interface IGetGroupedReportsUseCase {
  execute(
    page: number,
    limit: number,
    filters?: { status?: string; targetType?: string }
  ): Promise<GroupedReportsResponse>;
}
