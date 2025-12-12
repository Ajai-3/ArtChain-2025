import React from "react";
import { Gavel, Clock, CheckCircle, Ban } from "lucide-react";
import StatsCard from "../common/StatsCard";

interface AuctionStatsProps {
  stats: {
    total: number;
    active: number;
    scheduled: number;
    ended: number;
    cancelled: number; // API might return this
  };
}

const AuctionStats: React.FC<AuctionStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Active Auctions"
        value={stats.active || 0}
        icon={Gavel}
        iconColor="text-green-500"
        iconBgColor="bg-green-500/10"
      />
      <StatsCard
        title="Scheduled"
        value={stats.scheduled || 0}
        icon={Clock}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
      />
      <StatsCard
        title="Ended"
        value={stats.ended || 0}
        icon={CheckCircle}
        iconColor="text-zinc-500"
        iconBgColor="bg-zinc-500/10"
      />
      <StatsCard
        title="Total Auctions"
         // Using 'total' as a fallback if stats object structure differs, or specific cancelled field
        value={stats.total || 0}
        icon={Ban}
        iconColor="text-purple-500"
        iconBgColor="bg-purple-500/10"
      />
    </div>
  );
};

export default AuctionStats;
