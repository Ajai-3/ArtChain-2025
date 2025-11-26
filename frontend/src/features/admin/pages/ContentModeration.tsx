import { useState } from "react";

import { ReportStats } from "../components/moderation/ReportStats";
import { ReportFilters } from "../components/moderation/ReportFilters";
import { ReportPagination } from "../components/moderation/ReportPagination";
import { GroupedReportsSkeleton } from "../components/moderation/GroupedReportsSkeleton";
import { GroupedReportTable } from "../components/moderation/GroupedReportTable";
import { useGetGroupedReports } from "../hooks/contentModeration/useGetGroupedReports";
import AdminPageLayout from "../components/common/AdminPageLayout";

const ContentModeration = () => {
  const [status, setStatus] = useState("ALL");
  const [targetType, setTargetType] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading } = useGetGroupedReports({
    page,
    limit,
    status,
    targetType,
  });

  const groupedReports = data?.data || [];
  const totalPages = data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : 0;

  // Calculate stats from grouped reports
  const stats = groupedReports.reduce(
    (acc: { total: number; pending: number; resolved: number; dismissed: number }, report: any) => {
      acc.total += report.reportCount;
      if (report.status === "pending") acc.pending += report.reportCount;
      if (report.status === "resolved") acc.resolved += report.reportCount;
      if (report.status === "dismissed") acc.dismissed += report.reportCount;
      return acc;
    },
    { total: 0, pending: 0, resolved: 0, dismissed: 0 }
  );

  // Create mock reports array for stats display
  const mockReportsForStats: any[] = Array(stats.total).fill({ status: "pending" }).map((_, i) => {
    if (i < stats.resolved) return { status: "resolved" };
    if (i < stats.resolved + stats.dismissed) return { status: "dismissed" };
    return { status: "pending" };
  });

  return (
    <AdminPageLayout
      title="Content Moderation"
      description="Manage and review reported content across the platform."
    >
      {isLoading ? (
        <GroupedReportsSkeleton />
      ) : (
        <>
          {/* Stats */}
          <div className="mb-8">
            <ReportStats reports={mockReportsForStats} />
          </div>

          {/* Filters & Table */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <ReportFilters
                status={status}
                setStatus={(val) => {
                  setStatus(val);
                  setPage(1);
                }}
                targetType={targetType}
                setTargetType={(val) => {
                  setTargetType(val);
                  setPage(1);
                }}
              />
            </div>

            <GroupedReportTable groupedReports={groupedReports} />

            {/* Pagination */}
            <ReportPagination
              page={page}
              totalPages={totalPages}
              isLoading={isLoading}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </AdminPageLayout>
  );
};

export default ContentModeration;
