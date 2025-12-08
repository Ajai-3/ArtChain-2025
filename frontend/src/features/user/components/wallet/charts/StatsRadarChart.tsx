import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

interface StatsRadarChartProps {
  data: any[];
}

const StatsRadarChart: React.FC<StatsRadarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#444" strokeOpacity={0.5} />
        <PolarAngleAxis dataKey="name" tick={{ fill: "#888", fontSize: 10 }} />
        <PolarRadiusAxis
            angle={30}
            domain={[0, "auto"]}
            tick={false}
            axisLine={false}
        />
        <Radar
            name="Stats"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default StatsRadarChart;
