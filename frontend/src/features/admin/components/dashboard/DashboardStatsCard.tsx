import React from "react";
import type { LucideIcon } from "lucide-react";

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  badge?: string;
  className?: string; 
}

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
  title,
  value,
  subValue,
  trend,
  icon: Icon,
  badge,
  className = "",
}) => {

  return (
    <div className="relative rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900/50 dark:border-main-color/30">
      {/* Header: Icon and Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="rounded-lg p-2.5 bg-main-color/15">
          <Icon className="h-6 w-6 text-main-color" />
        </div>
        {badge && (
          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium border bg-main-color/10 text-primary border-main-color/20">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
      </div>

      {/* Footer: Subvalue and Trend */}
      {(subValue || trend) && (
        <div className="mt-4 flex items-center justify-between text-xs">
           {subValue ? (
               <span className="text-muted-foreground truncate max-w-[65%] text-[11px] sm:text-xs">
                {subValue}
               </span>
           ) : <span />}
        </div>
      )}
    </div>
  );
};

export default DashboardStatsCard; 