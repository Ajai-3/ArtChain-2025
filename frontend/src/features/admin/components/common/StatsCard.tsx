import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
}) => {
  const colorMap: Record<string, string> = {
    'bg-purple-500/10': 'border-purple-500/30',
    'bg-blue-500/10': 'border-blue-500/30',
    'bg-green-500/10': 'border-green-500/30',
    'bg-pink-500/10': 'border-pink-500/30',
    'bg-yellow-500/10': 'border-yellow-500/30',
    'bg-red-500/10': 'border-red-500/30',
    'bg-indigo-500/10': 'border-indigo-500/30',
    'bg-orange-500/10': 'border-orange-500/30',
    'bg-cyan-500/10': 'border-cyan-500/30',
  };
  
  const borderColor = colorMap[iconBgColor] || 'border-border/50';
  
  return (
    <div className={`relative border-2 ${borderColor} rounded-2xl p-5 sm:mb-3 shadow-md overflow-hidden`}>
      {/* Light colored background */}
      <div className={`absolute inset-0 ${iconBgColor} opacity-30`} />
      
      {/* Colored accent bar on left */}
      <div className={`absolute left-0 top-6 bottom-6 w-4 rounded-r-full ${iconBgColor}`} />
      
      <div className="relative flex justify-between items-start ml-3">
        <div className="flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</p>
          <h3 className={`text-3xl font-extrabold ${iconColor} drop-shadow-sm`}>{value}</h3>
        </div>
        <div className={`p-3.5 rounded-2xl ${iconBgColor} shadow-lg backdrop-blur-sm`}>
          <Icon className={`w-6 h-6 ${iconColor} drop-shadow-sm`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
