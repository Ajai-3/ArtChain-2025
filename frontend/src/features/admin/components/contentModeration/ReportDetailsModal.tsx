import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Separator } from "../../../../components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { Check, X, User, Image as ImageIcon, MessageSquare } from "lucide-react";
import type { GroupedReport } from "../../hooks/contentModeration/useGetGroupedReports";
import { useBulkUpdateReportStatus } from "../../hooks/contentModeration/useBulkUpdateReportStatus";
import { ReportTargetDisplay } from "./ReportTargetDisplay";

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupedReport: GroupedReport | null;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  isOpen,
  onClose,
  groupedReport,
}) => {
  const { mutate: bulkUpdate, isPending } = useBulkUpdateReportStatus();

  if (!groupedReport) return null;

  const handleBulkUpdate = (status: "resolved" | "dismissed") => {
    bulkUpdate(
      {
        targetId: groupedReport.targetId,
        targetType: groupedReport.targetType,
        status,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const getTargetIcon = () => {
    switch (groupedReport.targetType) {
      case "ART":
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case "COMMENT":
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case "USER":
        return <User className="h-5 w-5 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            {getTargetIcon()}
            <span>Report Details - {groupedReport.targetType}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto scrollbar pr-2 space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-3xl font-bold text-primary">{groupedReport.reportCount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className={
                  groupedReport.status === "pending"
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    : groupedReport.status === "resolved"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                }
              >
                {groupedReport.status}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Common Reason</p>
              <p className="text-sm font-semibold capitalize">
                {groupedReport.commonReason.replace("_", " ")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Latest Report</p>
              <p className="text-sm font-medium">
                {formatDistanceToNow(new Date(groupedReport.latestReportDate), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Target Content */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Reported Content</h3>
            <div className="bg-muted/30 rounded-lg p-4 border">
              <ReportTargetDisplay
                targetId={groupedReport.targetId}
                targetType={groupedReport.targetType as "ART" | "COMMENT" | "USER"}
              />
            </div>
          </div>

          <Separator />

          {/* All Reporters */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">
              Reporters ({groupedReport.reporters.length})
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto scrollbar pr-2">
              {groupedReport.reporters.map((reporter) => {
                // Find this reporter's reports
                const reporterReports = groupedReport.reports.filter(
                  (r: any) => r.reporterId === reporter.id
                );

                return (
                  <div
                    key={reporter.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-card border"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={reporter.profileImage || undefined} />
                      <AvatarFallback>{reporter.username[0]}</AvatarFallback>
                    </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{reporter.username}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reporterReports[0].createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {reporter.email}
                        </p>
                        {reporterReports.map((report: any) => (
                          <div key={report.id} className="mt-2 space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {report.reason.replace("_", " ")}
                              </Badge>
                            </div>
                            {report.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {report.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Close
          </Button>
          {groupedReport.status === "pending" && (
            <>
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                onClick={() => handleBulkUpdate("dismissed")}
                disabled={isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Dismiss All
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleBulkUpdate("resolved")}
                disabled={isPending}
              >
                <Check className="h-4 w-4 mr-2" />
                Resolve All
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
