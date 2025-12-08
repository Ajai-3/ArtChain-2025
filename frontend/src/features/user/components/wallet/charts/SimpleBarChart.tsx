import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface SimpleBarChartProps {
  data: any[];
  color: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, color }) => {
  if (!data || data.length === 0) {
      return <div className="text-xs text-muted-foreground w-full h-full flex items-center justify-center">No Data</div>;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#444" strokeOpacity={0.5} />
        <XAxis type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          width={80}
          tick={{ fill: "#888", fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
