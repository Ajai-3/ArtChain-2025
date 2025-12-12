import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface BreakdownPieChartProps {
  data: any[];
  colors: string[];
}

const BreakdownPieChart: React.FC<BreakdownPieChartProps> = ({ data, colors }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-xs text-muted-foreground w-full h-full flex items-center justify-center">
        No Data
      </div>
    );
  }

  const total = data.reduce((acc: number, curr: any) => acc + curr.value, 0);

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground w-full max-h-[100px] overflow-y-auto">
        {payload.map((entry: any, index: number) => {
          const val = data.find((d: any) => d.name === entry.value)?.value || 0;
          const percent = total > 0 ? ((val / total) * 100).toFixed(1) : "0";
          return (
            <li
              key={`item-${index}`}
              className="flex justify-between items-center w-full px-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.value}</span>
              </div>
              <span>
                {percent}% ({val})
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} verticalAlign="bottom" height={80} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BreakdownPieChart;
