import React from 'react';
import StatsCard from '../common/StatsCard';
import { Gavel, ShoppingCart, Gift, Coins, Users, Brush } from 'lucide-react';

interface PlatformConfig {
    auctionCommissionPercentage: number;
    artSaleCommissionPercentage: number;
    commissionArtPercentage: number;
    welcomeBonus: number;
    referralBonus: number;
    artCoinRate: number;
}

interface CommissionStatsCardsProps {
    config: PlatformConfig | null;
}

const CommissionStatsCards: React.FC<CommissionStatsCardsProps> = ({ config }) => {
    const stats = [
        {
            title: 'Auction Commission',
            value: `${config?.auctionCommissionPercentage || 0}%`,
            icon: Gavel,
            iconColor: 'text-purple-500',
            iconBgColor: 'bg-purple-500/10',
        },
        {
            title: 'Art Sale Commission',
            value: `${config?.artSaleCommissionPercentage || 0}%`,
            icon: ShoppingCart,
            iconColor: 'text-blue-500',
            iconBgColor: 'bg-blue-500/10',
        },
        {
            title: 'Commission Art',
            value: `${config?.commissionArtPercentage || 0}%`,
            icon: Brush,
            iconColor: 'text-cyan-500',
            iconBgColor: 'bg-cyan-500/10',
        },
        {
            title: 'Welcome Bonus',
            value: `${config?.welcomeBonus || 0} AC`,
            icon: Gift,
            iconColor: 'text-green-500',
            iconBgColor: 'bg-green-500/10',
        },
        {
            title: 'Referral Bonus',
            value: `${config?.referralBonus || 0} AC`,
            icon: Users,
            iconColor: 'text-pink-500',
            iconBgColor: 'bg-pink-500/10',
        },
        {
            title: 'Art Coin Rate',
            value: `₹${config?.artCoinRate || 10}`,
            icon: Coins,
            iconColor: 'text-yellow-500',
            iconBgColor: 'bg-yellow-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {stats.map((stat) => (
                <StatsCard key={stat.title} {...stat} />
            ))}
        </div>
    );
};

export default CommissionStatsCards;
