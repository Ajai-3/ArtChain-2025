import React from "react";
import { Image, CheckCircle, Archive, Trash2 } from "lucide-react";
import StatsCard from "../common/StatsCard";

interface ArtStatsProps {
  stats: {
    total: number;
    free: number;
    premium: number;
    aiGenerated: number;
  };
}

const ArtStats: React.FC<ArtStatsProps> = ({ stats = { total: 0, free: 0, premium: 0, aiGenerated: 0 } }) => {
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
        title="Free"
        value={stats.free}
        icon={CheckCircle}
        iconColor="text-green-500"
        iconBgColor="bg-green-500/10"
      />
      <StatsCard
        title="Premium"
        value={stats.premium}
        icon={Archive}
        iconColor="text-yellow-500"
        iconBgColor="bg-yellow-500/10"
      />
      <StatsCard
        title="AI Generated"
        value={stats.aiGenerated}
        icon={Trash2}
        iconColor="text-purple-500"
        iconBgColor="bg-purple-500/10"
      />
    </div>
  );
};

export default ArtStats;
