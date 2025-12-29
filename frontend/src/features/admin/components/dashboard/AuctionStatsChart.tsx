import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import type { AuctionCounts } from '../../hooks/dashboard/useDashboardStats';

interface AuctionStatsChartProps {
  stats: AuctionCounts;
  filter: string;
  onFilterChange: (value: string) => void;
}

const COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b']; // Green, Blue, Red, Amber

const AuctionStatsChart: React.FC<AuctionStatsChartProps> = ({ stats, filter, onFilterChange }) => {
  const data = [
    { name: 'Active', value: stats.active },
    { name: 'Sold', value: stats.sold },
    { name: 'Unsold', value: stats.unsold },
  ].filter(item => item.value > 0);

  // Fallback for empty data
  const chartData = data.length > 0 ? data : [{ name: 'No Data', value: 1 }];
  const chartColors = data.length > 0 ? COLORS : ['#e4e4e7'];

  return (
    <Card className="col-span-3 h-full shadow-sm border-zinc-200 dark:border-zinc-800">
      <CardHeader>
       <div className="flex justify-between"> <div className="space-y-1">
            <CardTitle className="text-xl">Auction Status</CardTitle>
            <CardDescription>Active vs Sold ratio</CardDescription>
        </div>
        <Tabs value={filter} onValueChange={onFilterChange} className="w-auto">
            <TabsList className="h-7 w-auto bg-muted/50 p-1">
                <TabsTrigger value="today" className="text-[10px] px-2 h-7 data-[state=active]:bg-background">1D</TabsTrigger>
                <TabsTrigger value="7d" className="text-[10px] px-2 h-7 data-[state=active]:bg-background">7D</TabsTrigger>
                <TabsTrigger value="30d" className="text-[10px] px-2 h-7 data-[state=active]:bg-background">1M</TabsTrigger>
                <TabsTrigger value="all" className="text-[10px] px-2 h-7 data-[state=active]:bg-background">All</TabsTrigger>
            </TabsList>
        </Tabs></div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {chartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle"/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuctionStatsChart;
