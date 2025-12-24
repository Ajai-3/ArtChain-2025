import React, { useState } from 'react';
import AdminPageLayout from '../components/common/AdminPageLayout';
import DashboardStatsCard from '../components/dashboard/DashboardStatsCard';
import { useRevenueStats } from '../hooks/dashboard/useRevenueStats';
import { useDashboardStats } from '../hooks/dashboard/useDashboardStats';
import { useTransactionStats } from '../hooks/dashboard/useTransactionStats';
import { useCommissionStats } from '../hooks/dashboard/useCommissionStats';
import { useAuctionStats } from '../hooks/dashboard/useAuctionStats';

import TopArtsTable from '../components/dashboard/TopArtsTable';
import RecentTransactionsTable from '../components/dashboard/RecentTransactionsTable';
import RecentAuctionsTable from '../components/dashboard/RecentAuctionsTable';
import RecentCommissionsTable from '../components/dashboard/RecentCommissionsTable';
import CategoryStatsChart from '../components/dashboard/CategoryStatsChart';
import AuctionStatsChart from '../components/dashboard/AuctionStatsChart';
import TransactionStatsChart from '../components/dashboard/TransactionStatsChart';
import CommissionStatsChart from '../components/dashboard/CommissionStatsChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import CustomLoader from '../../../components/CustomLoader';
import { Coins, Users, Gavel, Palette } from 'lucide-react';

const Dashboard: React.FC = () => {
    // Independent Filters
    const [revenueFilter, setRevenueFilter] = useState('7d');
    const [transactionFilter, setTransactionFilter] = useState('7d');
    const [commissionFilter, setCommissionFilter] = useState('7d');
    const [auctionFilter, setAuctionFilter] = useState('7d');

    // Data Fetching
    const { stats: dashboardStats, loading: dashboardLoading, error: dashboardError } = useDashboardStats(); // General stats (tables)
    const { stats: revenueStats } = useRevenueStats(revenueFilter);
    const { data: transactionStats } = useTransactionStats(transactionFilter);
    const { data: commissionStats } = useCommissionStats(commissionFilter);
    const { data: auctionStats } = useAuctionStats(auctionFilter);

    const loading = dashboardLoading;
    const error = dashboardError;

    const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

    if (loading) return <div className='flex h-full w-full items-center justify-center min-h-[500px]'><CustomLoader/></div>;
    if (error) return <div className="p-6 text-red-500 bg-red-500/10 rounded-lg m-4 border border-red-500/20">Error loading dashboard: {error}</div>;
    if (!dashboardStats) return <div className="p-8 text-center text-muted-foreground">No dashboard data available.</div>;

    // Revenue calculations
    const totalRevenue = revenueStats?.totalRevenue || 0;
    const auctionRevenue = revenueStats?.revenueBySource?.auctions || 0;
    const artSalesRevenue = revenueStats?.revenueBySource?.artSales || 0;
    const commissionRevenue = revenueStats?.revenueBySource?.commissions || 0;

    const pieData = [
        { name: 'Auctions', value: auctionRevenue },
        { name: 'Art Sales', value: artSalesRevenue },
        { name: 'Commissions', value: commissionRevenue },
    ].filter(item => item.value > 0);

    const areaData = revenueStats?.revenueByDate ? Object.entries(revenueStats.revenueByDate).map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        amount
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];

    return (
        <AdminPageLayout
            title="Dashboard"
            description="Real-time overview of ArtChain's performance."
        >
            {/* KPI Cards Grid */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <DashboardStatsCard
                    title="Total Users"
                    value={dashboardStats.userCounts?.total?.toLocaleString() || "0"}
                    subValue={`Users: ${dashboardStats.userCounts?.users || 0} | Artists: ${dashboardStats.userCounts?.artists || 0} | Banned: ${dashboardStats.userCounts?.banned || 0}`}
                    icon={Users}
                    badge="Live"
                />
                <DashboardStatsCard
                    title="Total Artworks"
                    value={dashboardStats.artworkCounts?.total?.toLocaleString() || "0"}
                    subValue={`Free: ${dashboardStats.artworkCounts?.free || 0} | Prem: ${dashboardStats.artworkCounts?.premium || 0} | AI: ${dashboardStats.artworkCounts?.aiGenerated || 0}`}
                    icon={Palette}
                    badge="Assets"
                />
                <DashboardStatsCard
                    title="ArtCoin Revenue"
                    value={`${totalRevenue.toFixed(0)} AC`}
                    subValue={`Auc: ${auctionRevenue.toFixed(0)} | Sales: ${artSalesRevenue.toFixed(0)} | Comm: ${commissionRevenue.toFixed(0)}`}
                    icon={Coins}
                    badge="AC"
                />
                <DashboardStatsCard
                    title="Auctions"
                    value={((dashboardStats.auctionCounts?.active || 0) + (dashboardStats.auctionCounts?.ended || 0)).toLocaleString()}
                    subValue={`Active: ${dashboardStats.auctionCounts?.active || 0} | Sold: ${dashboardStats.auctionCounts?.sold || 0} | Unsold: ${dashboardStats.auctionCounts?.unsold || 0}`}
                    icon={Gavel}
                    badge="Total"
                />
            </div>

            {/* Revenue Charts Section */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7 mb-6">
                {/* Revenue Area Chart */}
                <Card className="col-span-4 shadow-sm border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <div className="flex justify-between"> 
                        <div className="space-y-1">
                            <CardTitle>Revenue Trends</CardTitle>
                            <CardDescription>Performance over time</CardDescription>
                        </div>
                        <Tabs value={revenueFilter} onValueChange={setRevenueFilter} className="w-auto">
                            <TabsList className="h-8 w-auto bg-muted/50 p-1">
                                <TabsTrigger value="today" className="text-[10px] px-2 h-6 data-[state=active]:bg-background">1D</TabsTrigger>
                                <TabsTrigger value="7d" className="text-[10px] px-2 h-6 data-[state=active]:bg-background">7D</TabsTrigger>
                                <TabsTrigger value="30d" className="text-[10px] px-2 h-6 data-[state=active]:bg-background">1M</TabsTrigger>
                                <TabsTrigger value="all" className="text-[10px] px-2 h-6 data-[state=active]:bg-background">All</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[300px] w-full">
                            {areaData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#888888" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false} 
                                        />
                                        <YAxis 
                                            stroke="#888888" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}AC`}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--popover-foreground))' }}
                                            formatter={(value: number) => [`${value.toFixed(2)} AC`, 'Revenue']}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="amount" 
                                            stroke="#10B981" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorRevenue)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    No revenue data available for this period.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Distribution Pie Chart */}
                <Card className="col-span-3 shadow-sm border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <div className="space-y-1">
                            <CardTitle>Revenue Sources</CardTitle>
                            <CardDescription>Breakdown by income stream</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                             contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--popover-foreground))' }}
                                             formatter={(value: number) => `${value.toFixed(2)} AC`}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    No revenue distribution data.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Platform Stats Row 1: Top Arts & Category Stats */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7 mb-6">
                <TopArtsTable arts={dashboardStats.topArts} />
                <CategoryStatsChart stats={dashboardStats.categoryStats} />
            </div>

            {/* Platform Stats Row 2: Recent Auctions & Auction Status */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7 mb-6">
                <RecentAuctionsTable auctions={dashboardStats.recentAuctions} />
                <AuctionStatsChart 
                    stats={auctionStats || dashboardStats.auctionCounts} 
                    filter={auctionFilter}
                    onFilterChange={setAuctionFilter}
                /> 
            </div>
            
             {/* Platform Stats Row 3: Transaction Flow & Recent Transactions */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7 mb-6">
                <TransactionStatsChart 
                    stats={transactionStats || []} 
                    filter={transactionFilter}
                    onFilterChange={setTransactionFilter}
                />
                <RecentTransactionsTable transactions={dashboardStats.recentTransactions} />
            </div>

             {/* Platform Stats Row 4: Recent Commissions & Pipeline */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7 mb-8">
                <div className="col-span-full lg:col-span-4">
                     <RecentCommissionsTable commissions={dashboardStats.recentCommissions} />
                </div>
                <CommissionStatsChart 
                    stats={commissionStats || { REQUESTED: 0, AGREED: 0, IN_PROGRESS: 0, COMPLETED: 0 }} 
                    filter={commissionFilter}
                    onFilterChange={setCommissionFilter}
                />
            </div>
        </AdminPageLayout>
    );
}

export default Dashboard;
