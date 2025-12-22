
import type { Report } from "../../hooks/contentModeration/useAdminReports";
import { AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import StatsCard from "../common/StatsCard";

interface ReportStatsProps {
  reports: Report[];
}

export const ReportStats: React.FC<ReportStatsProps> = ({ reports }) => {
  const total = reports.length;
  const pending = reports.filter((r) => r.status === "pending").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;
  const dismissed = reports.filter((r) => r.status === "dismissed").length;

  const stats = [
    {
      title: "Total Reports",
      value: total,
      icon: AlertCircle,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-500/10",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      iconColor: "text-yellow-500",
      iconBgColor: "bg-yellow-500/10",
    },
    {
      title: "Resolved",
      value: resolved,
      icon: CheckCircle,
      iconColor: "text-green-500",
      iconBgColor: "bg-green-500/10",
    },
    {
      title: "Dismissed",
      value: dismissed,
      icon: XCircle,
      iconColor: "text-red-500",
      iconBgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
          iconBgColor={stat.iconBgColor}
        />
      ))}
    </div>
  );
};
