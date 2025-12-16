import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { GroupedReport } from "../../hooks/contentModeration/useGetGroupedReports";
import { ReporterAvatarStack } from "./ReporterAvatarStack";
import { ReportDetailsModal } from "./ReportDetailsModal";

interface GroupedReportTableProps {
  groupedReports: GroupedReport[];
}

export const GroupedReportTable: React.FC<GroupedReportTableProps> = ({
  groupedReports,
}) => {
  const [selectedReport, setSelectedReport] = useState<GroupedReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (report: GroupedReport) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "dismissed":
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500";
    }
  };

  const getTargetTypeColor = (type: string) => {
    switch (type) {
      case "ART":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "COMMENT":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "USER":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500";
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-zinc-900">
              <TableHead className="px-4 py-2">Target Type</TableHead>
              <TableHead className="px-4 py-2">Reports</TableHead>
              <TableHead className="px-4 py-2">Reporters</TableHead>
              <TableHead className="px-4 py-2">Common Reason</TableHead>
              <TableHead className="px-4 py-2">Status</TableHead>
              <TableHead className="px-4 py-2">Latest Report</TableHead>
              <TableHead className="px-4 py-2 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No reports found.
                </TableCell>
              </TableRow>
            ) : (
              groupedReports.map((report) => (
                <TableRow
                  key={`${report.targetId}-${report.targetType}`}
                  className="hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <TableCell className="px-4 py-2">
                    <Badge
                      variant="outline"
                      className={`${getTargetTypeColor(report.targetType)} w-fit`}
                    >
                      {report.targetType}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          report.reportCount >= 10
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : report.reportCount >= 5
                            ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }
                      >
                        {report.reportCount} {report.reportCount === 1 ? "report" : "reports"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <ReporterAvatarStack reporters={report.reporters} maxVisible={3} />
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <span className="text-sm capitalize">
                      {report.commonReason.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(report.status)} capitalize`}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(report.latestReportDate), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(report)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ReportDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReport(null);
        }}
        groupedReport={selectedReport}
      />
    </>
  );
};
