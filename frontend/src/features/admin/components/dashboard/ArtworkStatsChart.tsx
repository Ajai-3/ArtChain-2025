import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import type { ArtworkCounts } from '../../hooks/dashboard/useDashboardStats';

interface ArtworkStatsChartProps {
  stats: ArtworkCounts;
}

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4']; // Violet, Pink, Cyan

const ArtworkStatsChart: React.FC<ArtworkStatsChartProps> = ({ stats }) => {
  const data = [
    { name: 'Standard', value: stats.free }, // Assuming 'free' is standard/uploaded
    { name: 'Premium', value: stats.premium },
    { name: 'AI Gen', value: stats.aiGenerated },
  ];

  return (
    <Card className="col-span-4 h-full shadow-sm border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <div className="space-y-1">
            <CardTitle className="text-xl">Artwork Types</CardTitle>
            <CardDescription>Distribution by origin</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" opacity={0.1} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                fontSize={12}
                width={70}
              />
              <Tooltip 
                 cursor={{fill: 'transparent'}}
                 contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtworkStatsChart;
