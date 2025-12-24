import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import type { TransactionVolume } from '../../hooks/dashboard/useDashboardStats';

interface TransactionStatsChartProps {
  stats: TransactionVolume[];
  filter: string;
  onFilterChange: (value: string) => void;
}

const TransactionStatsChart: React.FC<TransactionStatsChartProps> = ({ stats, filter, onFilterChange }) => {
  const data = stats && stats.length > 0 ? stats : [
      { date: 'Mon', earned: 0, spent: 0 },
      { date: 'Tue', earned: 0, spent: 0 },
      { date: 'Wed', earned: 100, spent: -50 },
  ];

  return (
    <Card className="col-span-4 h-full shadow-sm border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <div className="flex justify-between"> 
  <div className="space-y-1">
    <CardTitle className="text-xl">Net Flow</CardTitle>
    <CardDescription>Earnings vs Spending</CardDescription>
  </div>

  <Tabs value={filter} onValueChange={onFilterChange} className="w-auto">
    <TabsList className="h-7 w-auto bg-muted/50 p-1">
      <TabsTrigger value="today" className="text-[10px] px-2 h-7 data-[state=active]:bg-background">
        1D
      </TabsTrigger>
      <TabsTrigger value="7d" className="text-[10px] px-2 h-7 data-[state=active]:bg-background">
        7D
      </TabsTrigger>
      <TabsTrigger value="30d" className="text-[10px] px-2 h-7 data-[state=active]:bg-background">
        1M
      </TabsTrigger>
      <TabsTrigger value="all" className="text-[10px] px-2 h-7 data-[state=active]:bg-background">
        All
      </TabsTrigger>
    </TabsList>
  </Tabs>
  </div>
</CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis hide />
              <Tooltip 
                 contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                 cursor={{fill: 'transparent'}}
              />
              <Legend verticalAlign="top" align="right" height={36}/>
              <Bar dataKey="earned" name="Earned" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="spent" name="Spent" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionStatsChart;
