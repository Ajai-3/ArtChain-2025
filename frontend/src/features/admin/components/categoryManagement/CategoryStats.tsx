import React from "react";
import { FolderOpen, CheckCircle, XCircle, TrendingDown } from "lucide-react";
import StatsCard from "../common/StatsCard";

interface CategoryStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    lowUsage: number;
  };
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatsCard
        title="Total Categories"
        value={stats.total}
        icon={FolderOpen}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
      />
      <StatsCard
        title="Active"
        value={stats.active}
        icon={CheckCircle}
        iconColor="text-green-500"
        iconBgColor="bg-green-500/10"
      />
      <StatsCard
        title="Inactive"
        value={stats.inactive}
        icon={XCircle}
        iconColor="text-red-500"
        iconBgColor="bg-red-500/10"
      />
      <StatsCard
        title="Low Usage"
        value={stats.lowUsage}
        icon={TrendingDown}
        iconColor="text-orange-500"
        iconBgColor="bg-orange-500/10"
      />
    </div>
  );
};

export default CategoryStats;
