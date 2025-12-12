import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface TrendAreaChartProps {
  data: any[];
}

const TrendAreaChart: React.FC<TrendAreaChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorAmountTrend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          stroke="#888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} strokeOpacity={0.5} />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorAmountTrend)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TrendAreaChart;
