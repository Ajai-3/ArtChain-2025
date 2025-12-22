import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface StatsRadarChartProps {
  data: any[];
}

const STAT_COLORS: Record<string, string> = {
  "Earned": "#10b981",   
  "Spent": "#ef4444",    
  "Avg Tx": "#8b5cf6",    
  "ROI": "#f59e0b",      
};

const StatsRadarChart: React.FC<StatsRadarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-xs text-muted-foreground w-full h-full flex items-center justify-center">
        No stats data available
      </div>
    );
  }

  // Custom label renderer for values on bars
  const renderCustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width + 5}
        y={y + 10}
        fill="#fff"
        fontSize={12}
        fontWeight="600"
      >
        {value}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data}
        layout="vertical"
        margin={{ top: 15, right: 60, left: 10, bottom: 15 }}
      >
        <defs>
          {Object.entries(STAT_COLORS).map(([name, color]) => (
            <linearGradient key={name} id={`gradient-${name}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="100%" stopColor={color} stopOpacity={1}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#333" 
          strokeOpacity={0.2} 
          horizontal={true}
          vertical={false}
        />
        <XAxis 
          type="number"
          stroke="#666" 
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          type="category"
          dataKey="name" 
          stroke="#888" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
        <Bar 
          dataKey="value" 
          radius={[0, 8, 8, 0]}
          barSize={28}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`url(#gradient-${entry.name})`}
            />
          ))}
          <LabelList 
            dataKey="value" 
            content={renderCustomLabel}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StatsRadarChart;
