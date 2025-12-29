import React from 'react';
import { Users, Palette, Coins, Gavel } from 'lucide-react';
import DashboardStatsCard from './DashboardStatsCard';
import type { DashboardStats } from '../../hooks/dashboard/useDashboardStats';

interface DashboardKPIGridProps {
    stats: DashboardStats;
    artCoinRate: number;
    revenueStats: any;
}

const DashboardKPIGrid: React.FC<DashboardKPIGridProps> = ({ stats, artCoinRate, revenueStats }) => {
    const totalRevenue = revenueStats?.totalRevenue || 0;
    const auctionRevenue = revenueStats?.revenueBySource?.auctions?.amount || 0;
    const artSalesRevenue = revenueStats?.revenueBySource?.artSales?.amount || 0;
    const commissionRevenue = revenueStats?.revenueBySource?.commissions?.amount || 0;
    
    const totalRevenueInRupees = totalRevenue * artCoinRate;

    return (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <DashboardStatsCard
                title="Total Users"
                value={stats.userCounts?.total?.toLocaleString() || "0"}
                subValue={`Users: ${stats.userCounts?.users || 0} | Artists: ${stats.userCounts?.artists || 0} | Banned: ${stats.userCounts?.banned || 0}`}
                icon={Users}
                badge="Live"
            />
            <DashboardStatsCard
                title="Total Artworks"
                value={stats.artworkCounts?.total?.toLocaleString() || "0"}
                subValue={`Free: ${stats.artworkCounts?.free || 0} | Prem: ${stats.artworkCounts?.premium || 0} | AI: ${stats.artworkCounts?.aiGenerated || 0}`}
                icon={Palette}
                badge="Assets"
            />
            <DashboardStatsCard
                title="Platform Revenue"
                value={`₹${totalRevenueInRupees.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                subValue={`${totalRevenue.toFixed(0)} AC | Auc: ${auctionRevenue.toFixed(0)} | Sales: ${artSalesRevenue.toFixed(0)} | Comm: ${commissionRevenue.toFixed(0)}`}
                icon={Coins}
                badge="Revenue"
            />
            <DashboardStatsCard
                title="Auctions"
                value={((stats.auctionCounts?.active || 0) + (stats.auctionCounts?.ended || 0)).toLocaleString()}
                subValue={`Active: ${stats.auctionCounts?.active || 0} | Sold: ${stats.auctionCounts?.sold || 0} | Unsold: ${stats.auctionCounts?.unsold || 0}`}
                icon={Gavel}
                badge="Total"
            />
        </div>
    );
};

export default DashboardKPIGrid;
