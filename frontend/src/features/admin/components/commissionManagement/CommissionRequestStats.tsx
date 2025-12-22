import React from 'react';
import StatsCard from '../common/StatsCard';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Percent 
} from 'lucide-react';
import { useCommissionStatsQuery } from '../../hooks/commissionManagement/useCommissionStatsQuery';
import CustomLoader from '../../../../components/CustomLoader';

const CommissionRequestStats: React.FC = () => {
    const { data: stats, isLoading } = useCommissionStatsQuery();

    if (isLoading) return <div className="h-24"><CustomLoader size={20} /></div>;
    if (!stats) return null;

    const cards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            iconColor: 'text-yellow-500',
            iconBgColor: 'bg-yellow-500/10',
        },
        {
            title: 'Current Fee',
            value: `${stats.currentCommissionPercentage}%`,
            icon: Percent,
            iconColor: 'text-purple-500',
            iconBgColor: 'bg-purple-500/10',
        },
        {
            title: 'Total Requests',
            value: stats.totalRequests,
            icon: Users,
            iconColor: 'text-zinc-500',
            iconBgColor: 'bg-zinc-500/10',
        },
        {
            title: 'In Progress',
            value: stats.inProgressRequests,
            icon: Clock,
            iconColor: 'text-indigo-500',
            iconBgColor: 'bg-indigo-500/10',
        },
        {
            title: 'Completed',
            value: stats.completedRequests,
            icon: CheckCircle2,
            iconColor: 'text-emerald-500',
            iconBgColor: 'bg-emerald-500/10',
        },
        {
            title: 'Active Disputes',
            value: stats.activeDisputes,
            icon: AlertCircle,
            iconColor: 'text-red-500',
            iconBgColor: 'bg-red-500/10',
        },
        
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
            {cards.map((card) => (
                <StatsCard key={card.title} {...card} />
            ))}
        </div>
    );
};

export default CommissionRequestStats;
