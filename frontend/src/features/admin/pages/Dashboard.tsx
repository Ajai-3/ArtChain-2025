import React from 'react';
import AdminPageLayout from '../components/common/AdminPageLayout';
import StatsCard from '../components/common/StatsCard';
import { useRevenueStats } from '../hooks/dashboard/useRevenueStats';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import CustomLoader from '../../../components/CustomLoader';
import { Coins } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { stats, loading, error } = useRevenueStats();

    const COLORS = ['#8B5CF6', '#3B82F6'];
    const ART_COIN_RATE = 10; // 1 AC = ₹10

    if (loading) return <div className='flex h-full w-full items-center justify-center'><CustomLoader/></div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!stats) return <div className="p-4">No revenue data available</div>;

    // Revenue stats with safety checks
    const totalRevenue = stats?.totalRevenue || 0;
    const auctionRevenue = stats?.revenueBySource?.auctions || 0;
    const artSalesRevenue = stats?.revenueBySource?.artSales || 0;

    const pieData = [
        { name: 'Auctions', value: auctionRevenue },
        { name: 'Art Sales', value: artSalesRevenue },
    ].filter(item => item.value > 0);

    const areaData = stats.revenueByDate ? Object.entries(stats.revenueByDate).map(([date, amount]) => ({
        date,
        amount
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];

    return (
        <AdminPageLayout
            title="Dashboard"
            description="Overview of platform performance and revenue"
        >
            {/* Total Revenue Card */}
            <div className="mb-8">
                <StatsCard
                    title="Total Platform Revenue"
                    value={`${totalRevenue.toFixed(2)} AC (₹${(totalRevenue * ART_COIN_RATE).toFixed(2)})`}
                    icon={Coins}
                    iconColor="text-green-500"
                    iconBgColor="bg-green-500/10"
                />
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                         <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={areaData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip 
                                        formatter={(value: number) => [`${value.toFixed(2)} AC`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Revenue Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value: number) => `${value.toFixed(2)} AC`}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminPageLayout>
    );
}

export default Dashboard;