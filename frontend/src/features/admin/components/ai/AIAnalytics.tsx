import React from "react";
import { Activity, Image as ImageIcon, Zap } from "lucide-react";

interface AIAnalyticsProps {
  totalGenerations: number;
  activeModels: number;
}

const AIAnalytics: React.FC<AIAnalyticsProps> = ({ totalGenerations, activeModels }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Generations</p>
            <h3 className="text-2xl font-bold mt-2">{totalGenerations}</h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Models</p>
            <h3 className="text-2xl font-bold mt-2">{activeModels}</h3>
          </div>
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Activity className="w-5 h-5 text-green-500" />
          </div>
        </div>
      </div>

       <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">System Status</p>
            <h3 className="text-2xl font-bold mt-2">Operational</h3>
          </div>
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;
