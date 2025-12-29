import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueSourceChartProps {
    revenueBySource: {
        auctions: { amount: number; count: number };
        artSales: { amount: number; count: number };
        commissions: { amount: number; count: number };
    } | undefined;
}

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].fill }} />
                    <p className="font-bold text-zinc-100 text-sm">{data.name}</p>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-zinc-400 text-xs">Revenue</span>
                        <span className="text-zinc-100 font-mono font-medium text-sm">₹{data.value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <span className="text-zinc-400 text-xs">Transactions</span>
                        <span className="text-zinc-100 font-medium text-sm">{data.count} txs</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const RevenueSourceChart: React.FC<RevenueSourceChartProps> = ({ revenueBySource }) => {
    const pieData = revenueBySource ? [
        { name: 'Auctions', value: revenueBySource.auctions.amount, count: revenueBySource.auctions.count },
        { name: 'Art Sales', value: revenueBySource.artSales.amount, count: revenueBySource.artSales.count },
        { name: 'Commissions', value: revenueBySource.commissions.amount, count: revenueBySource.commissions.count },
    ].filter(item => item.value > 0) : [];

    return (
        <Card className="col-span-3 shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
            <CardHeader className="pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-bold">Revenue Sources</CardTitle>
                    <CardDescription>Income stream distribution</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[280px] w-full mt-4">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                    animationBegin={200}
                                    animationDuration={1200}
                                >
                                    {pieData.map((_entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]} 
                                            stroke="rgba(0,0,0,0.1)" 
                                            strokeWidth={2}
                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    formatter={(value) => <span className="text-xs font-medium text-zinc-500">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full flex-center items-center justify-center text-muted-foreground">
                            No revenue distribution data.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default RevenueSourceChart;
