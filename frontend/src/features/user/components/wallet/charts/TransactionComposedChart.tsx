import React from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface TransactionComposedChartProps {
  data: any[];
}

const TransactionComposedChart: React.FC<TransactionComposedChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid stroke="#888" strokeOpacity={0.1} />
        <XAxis
          dataKey="date"
          scale="band"
          stroke="#888"
          fontSize={10}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px", color: "#888" }} />

        {/* Income Bar (Green) */}
        <Bar
          dataKey="income"
          name="Earned"
          barSize={20}
          fill="#4ade80"
          radius={[4, 4, 0, 0]}
        />
        {/* Expense Bar (Red) */}
        <Bar
          dataKey="expense"
          name="Spent"
          barSize={20}
          fill="#f87171"
          radius={[4, 4, 0, 0]}
        />
        {/* Net Gain - Line (Orange/Blue) */}
        <Line
          type="monotone"
          dataKey="income"
          name="Trend"
          stroke="#ff7300"
          dot={false}
          strokeWidth={2}
        />
        {/* Optional Area for Visuals */}
        <Area
          type="monotone"
          dataKey="income"
          name="Gain Volume"
          fill="#8884d8"
          stroke="#8884d8"
          fillOpacity={0.1}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TransactionComposedChart;
