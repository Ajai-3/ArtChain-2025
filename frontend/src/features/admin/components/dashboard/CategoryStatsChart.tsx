import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import type { CategoryStat } from '../../hooks/dashboard/useDashboardStats';

interface CategoryStatsChartProps {
  stats: CategoryStat[];
}

const COLORS = ['#8884d8', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

const CategoryStatsChart: React.FC<CategoryStatsChartProps> = ({ stats }) => {
  const data = stats.length > 0 
    ? [...stats]
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((s, i) => ({
            name: s.category,
            count: s.count,
            fill: COLORS[i % COLORS.length]
        }))
    : [{ name: 'No Data', count: 0, fill: '#f4f4f5' }];

  return (
    <Card className="col-span-3 h-full shadow-sm border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <div className="space-y-1">
            <CardTitle className="text-xl">Top Categories</CardTitle>
            <CardDescription>Most popular art types</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="20%" 
                outerRadius="90%" 
                barSize={20} 
                data={data}
            >
              <RadialBar
                background={{ fill: 'rgba(255,255,255,0.05)' }}
                dataKey="count"
                cornerRadius={5}
                label={{ position: 'insideStart', fill: '#fff' }}
              />
              <Legend 
                iconSize={10} 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ lineHeight: '24px' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                cursor={false}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryStatsChart;
