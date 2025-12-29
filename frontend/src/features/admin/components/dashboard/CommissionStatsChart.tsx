import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip, Cell } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import type { CommissionCounts } from '../../hooks/dashboard/useDashboardStats';

interface CommissionStatsChartProps {
  stats: CommissionCounts;
  filter: string;
  onFilterChange: (value: string) => void;
}

const CommissionStatsChart: React.FC<CommissionStatsChartProps> = ({ stats, filter, onFilterChange }) => {
  const s = stats || { REQUESTED: 0, AGREED: 0, IN_PROGRESS: 0, COMPLETED: 0 };
  
  const data = [
      { value: s.REQUESTED || 0, name: 'Requested', fill: '#facc15' },
      { value: s.AGREED || 0, name: 'Agreed', fill: '#fb923c' },
      { value: s.IN_PROGRESS || 0, name: 'In Progress', fill: '#3b82f6' },
      { value: s.COMPLETED || 0, name: 'Completed', fill: '#22c55e' }
  ];

  // If all are zero, might want to show placeholder or let it be empty
  const hasData = data.some(d => d.value > 0);
  const displayData = hasData ? data.filter(d => d.value > 0) : [{ value: 1, name: 'No Active Pipeline', fill: '#f4f4f5' }];

  return (
    <Card className="col-span-3 h-full shadow-sm border-zinc-200 dark:border-zinc-800">
      <CardHeader>
         <div className="flex justify-between"> 
        <div className="space-y-1">
            <CardTitle className="text-xl">Commission Pipeline</CardTitle>
            <CardDescription>Conversion funnel</CardDescription>
        </div>
        <Tabs value={filter} onValueChange={onFilterChange} className="w-auto">
            <TabsList className="h-7 w-auto bg-muted/50 p-1">
                <TabsTrigger value="today" className="text-[10px] px-2 h-7 data-[state=active]:bg-background">1D</TabsTrigger>
                <TabsTrigger value="7d" className="text-[10px] px-2 h-7 data-[state=active]:bg-background">7D</TabsTrigger>
                <TabsTrigger value="30d" className="text-[10px] px-2 h-7 data-[state=active]:bg-background">1M</TabsTrigger>
                <TabsTrigger value="all" className="text-[10px] px-2 h-7 data-[state=active]:bg-background">All</TabsTrigger>
            </TabsList>
        </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                cursor={false}
              />
              <Funnel
                dataKey="value"
                data={displayData}
                isAnimationActive
              >
                <LabelList position="right" fill="#888" stroke="none" dataKey="name" />
                {displayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionStatsChart;
