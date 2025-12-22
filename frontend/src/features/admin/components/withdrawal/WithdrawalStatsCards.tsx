import React, { useMemo } from "react";
import StatsCard from "../common/StatsCard";
import { Clock, FileCheck, CheckCircle2, FileText } from "lucide-react";

interface WithdrawalStatsCardsProps {
  totalCount: number;
  statusCounts: Record<string, number>;
}

const WithdrawalStatsCards: React.FC<WithdrawalStatsCardsProps> = ({
  totalCount,
  statusCounts,
}) => {
  const stats = useMemo(() => {
    const pending = statusCounts.PENDING || 0;
    const approved = (statusCounts.APPROVED || 0) + (statusCounts.PROCESSING || 0);
    const completed = statusCounts.COMPLETED || 0;

    return [
      {
        title: "Total Requests",
        value: totalCount,
        icon: FileText,
        iconColor: "text-purple-500",
        iconBgColor: "bg-purple-500/10",
      },
      {
        title: "Pending",
        value: pending,
        icon: Clock,
        iconColor: "text-yellow-500",
        iconBgColor: "bg-yellow-500/10",
      },
      {
        title: "Approved",
        value: approved,
        icon: FileCheck,
        iconColor: "text-blue-500",
        iconBgColor: "bg-blue-500/10",
      },
      {
        title: "Completed",
        value: completed,
        icon: CheckCircle2,
        iconColor: "text-green-500",
        iconBgColor: "bg-green-500/10",
      },
    ];
  }, [totalCount, statusCounts]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default WithdrawalStatsCards;
