import React from "react";
import { Gavel, Clock, CheckCircle, Ban } from "lucide-react";
import StatsCard from "../common/StatsCard";

interface AuctionStatsProps {
  stats: {
    active: number;
    ended: number;
    sold: number;
    unsold: number;
  };
}

const AuctionStats: React.FC<AuctionStatsProps> = ({ stats }) => {
  const total = (stats.active || 0) + (stats.ended || 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Auctions"
        value={total}
        icon={Gavel}
        iconColor="text-purple-500"
        iconBgColor="bg-purple-500/10"
      />
      <StatsCard
        title="Active"
        value={stats.active || 0}
        icon={Clock}
        iconColor="text-green-500"
        iconBgColor="bg-green-500/10"
      />
      <StatsCard
        title="Sold"
        value={stats.sold || 0}
        icon={CheckCircle}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
      />
      <StatsCard
        title="Unsold"
        value={stats.unsold || 0}
        icon={Ban}
        iconColor="text-zinc-500"
        iconBgColor="bg-zinc-500/10"
      />
    </div>
  );
};

export default AuctionStats;
