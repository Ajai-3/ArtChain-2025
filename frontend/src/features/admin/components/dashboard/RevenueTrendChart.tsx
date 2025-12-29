import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';

interface RevenueTrendChartProps {
    revenueByDate: Record<string, number> | undefined;
    filter: string;
    onFilterChange: (value: string) => void;
}

const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ revenueByDate, filter, onFilterChange }) => {
    const areaData = revenueByDate ? Object.entries(revenueByDate).map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        originalDate: new Date(date).getTime(),
        amount
    })).sort((a, b) => a.originalDate - b.originalDate) : [];

    return (
        <Card className="col-span-4 shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader>
                <div className="flex justify-between"> 
                    <div className="space-y-1">
                        <CardTitle>Revenue Trends</CardTitle>
                        <CardDescription>Performance over time</CardDescription>
                    </div>
                    <Tabs value={filter} onValueChange={onFilterChange} className="w-auto">
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
    );
};

export default RevenueTrendChart;
