import React from "react";
import TrendAreaChart from "./charts/TrendAreaChart";
import BreakdownPieChart from "./charts/BreakdownPieChart";
import StatsRadarChart from "./charts/StatsRadarChart";
import TransactionComposedChart from "./charts/TransactionComposedChart";
import SimpleBarChart from "./charts/SimpleBarChart";

interface WalletChartProps {
  mode: "trend" | "breakdown" | "stats" | "line-breakdown" | "composed"; 
  activeSubTab?: "earned" | "spent" | "overview"; 
  data: any[]; 
}

const COLORS = {
  earned: ["#4ade80", "#22c55e", "#16a34a", "#15803d", "#86efac"],
  spent: ["#f87171", "#ef4444", "#dc2626", "#b91c1c", "#fca5a5"],
};

const WalletChart: React.FC<WalletChartProps> = ({ mode, activeSubTab, data }) => {
  
  if (mode === "trend") {
      return <TrendAreaChart data={data} />;
  }

  if (mode === "breakdown") {
    const colors = activeSubTab === "spent" ? COLORS.spent : COLORS.earned;
    return <BreakdownPieChart data={data} colors={colors} />;
  }

  if (mode === "stats") {
      return <StatsRadarChart data={data} />;
  }

  if (mode === "composed") {
    return <TransactionComposedChart data={data} />;
  }

  if (mode === "line-breakdown") {
    const color = activeSubTab === "spent" ? "#f87171" : "#4ade80"; 
    return <SimpleBarChart data={data} color={color} />;
  }

  return null;
};

export default WalletChart;
