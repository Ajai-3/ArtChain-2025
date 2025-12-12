import React from "react";
import { Activity, Image as ImageIcon, Zap } from "lucide-react";
import StatsCard from "../common/StatsCard";

interface AIAnalyticsProps {
  totalGenerations: number;
  activeModels: number;
}

const AIAnalytics: React.FC<AIAnalyticsProps> = ({ totalGenerations, activeModels }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatsCard
        title="Total Generations"
        value={totalGenerations}
        icon={ImageIcon}
        iconColor="text-primary"
        iconBgColor="bg-primary/10"
      />
      <StatsCard
        title="Active Models"
        value={activeModels}
        icon={Activity}
        iconColor="text-green-500"
        iconBgColor="bg-green-500/10"
      />
      <StatsCard
        title="System Status"
        value="Operational"
        icon={Zap}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
      />
    </div>
  );
};

export default AIAnalytics;
