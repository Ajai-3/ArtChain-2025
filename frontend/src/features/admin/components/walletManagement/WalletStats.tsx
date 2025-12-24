import React from "react";
import { Wallet, CheckCircle, Ban, Lock } from "lucide-react";
import StatsCard from "../common/StatsCard";

interface WalletStatsProps {
  stats: {
    totalWallets: number;
    activeWallets: number;
    suspendedWallets: number;
    lockedWallets: number;
  };
}


const WalletStats: React.FC<WalletStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatsCard
        title="Total Wallets"
        value={stats.totalWallets}
        icon={Wallet}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
      />
      <StatsCard
        title="Active"
        value={stats.activeWallets}
        icon={CheckCircle}
        iconColor="text-green-500"
        iconBgColor="bg-green-500/10"
      />
      <StatsCard
        title="Suspended"
        value={stats.suspendedWallets}
        icon={Ban}
        iconColor="text-orange-500"
        iconBgColor="bg-orange-500/10"
      />
      <StatsCard
        title="Locked"
        value={stats.lockedWallets}
        icon={Lock}
        iconColor="text-red-500"
        iconBgColor="bg-red-500/10"
      />
    </div>
  );
};

export default WalletStats;
