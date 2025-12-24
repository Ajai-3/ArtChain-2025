import React from "react";
import { Users, CheckCircle, Ban, Palette } from "lucide-react";
import StatsCard from "../common/StatsCard";

interface UserStatsProps {
  stats: {
    total: number;
    active: number;
    banned: number;
    artists: number;
  };
}

const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatsCard
        title="Total Users"
        value={stats.total}
        icon={Users}
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
        title="Banned"
        value={stats.banned}
        icon={Ban}
        iconColor="text-red-500"
        iconBgColor="bg-red-500/10"
      />
      <StatsCard
        title="Artists"
        value={stats.artists}
        icon={Palette}
        iconColor="text-purple-500"
        iconBgColor="bg-purple-500/10"
      />
    </div>
  );
};

export default UserStats;
