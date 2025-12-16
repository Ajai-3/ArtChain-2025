
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import type { Report } from "../../hooks/contentModeration/useAdminReports";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ReportTargetDisplay } from "./ReportTargetDisplay";
import { Button } from "../../../../components/ui/button";
import { Eye, Check, X } from "lucide-react";

interface ReportTableProps {
  reports: Report[];
}

export const ReportTable: React.FC<ReportTableProps> = ({ reports }) => {
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

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-zinc-900">
            <TableHead className="px-4 py-2 text-left">Reporter</TableHead>
            <TableHead className="px-4 py-2 text-left">Target</TableHead>
            <TableHead className="px-4 py-2 text-left">Reason</TableHead>
            <TableHead className="px-4 py-2 text-left">Status</TableHead>
            <TableHead className="px-4 py-2 text-left">Date</TableHead>
            <TableHead className="px-4 py-2 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                No reports found.
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.id} className="hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                <TableCell className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={report.reporter.profileImage || undefined} />
                      <AvatarFallback>{report.reporter.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {report.reporter.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {report.reporter.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant="outline"
                      className={
                        report.targetType === "ART"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20 w-fit"
                          : report.targetType === "COMMENT"
                          ? "bg-purple-500/10 text-purple-500 border-purple-500/20 w-fit"
                          : "bg-orange-500/10 text-orange-500 border-orange-500/20 w-fit"
                      }
                    >
                      {report.targetType}
                    </Badge>
                    <ReportTargetDisplay
                      targetId={report.targetId}
                      targetType={report.targetType}
                    />
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium capitalize">
                      {report.reason.replace("_", " ")}
                    </span>
                    {report.description && (
                      <span className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {report.description}
                      </span>
                    )}
                  </div>
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
                  {formatDistanceToNow(new Date(report.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {report.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
