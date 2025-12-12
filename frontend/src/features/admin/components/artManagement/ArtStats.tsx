import React from "react";
import { Image, CheckCircle, Archive, Trash2 } from "lucide-react";
import StatsCard from "../common/StatsCard";

interface ArtStatsProps {
  stats: {
    total: number;
    active: number;
    archived: number;
    deleted: number;
  };
}

const ArtStats: React.FC<ArtStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Arts"
        value={stats.total}
        icon={Image}
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
        title="Archived"
        value={stats.archived}
        icon={Archive}
        iconColor="text-yellow-500"
        iconBgColor="bg-yellow-500/10"
      />
      <StatsCard
        title="Deleted"
        value={stats.deleted}
        icon={Trash2}
        iconColor="text-red-500"
        iconBgColor="bg-red-500/10"
      />
    </div>
  );
};

export default ArtStats;
