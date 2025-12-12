import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import WalletChart from "./WalletChart";

interface WalletSummaryStatsProps {
  summary: { 
      totalCredited: number; 
      totalDebited: number; 
      businessEarned: number; 
      businessSpent: number; 
      netGain: number; 
      netFlow: number; 
  };
  activeTab: "overview" | "earned" | "spent";
  setActiveTab: (tab: "overview" | "earned" | "spent") => void;
  timeRange: "7d" | "1m" | "all";
  setTimeRange: (range: "7d" | "1m" | "all") => void;
  chartData: {
    overview: any[];
    businessEarned: any[];
    businessSpent: any[];
  };
  className?: string;
}

const WalletSummaryStats: React.FC<WalletSummaryStatsProps> = ({
  summary,
  activeTab,
  setActiveTab,
  timeRange,
  setTimeRange,
  chartData,
  className,
}) => {
  return (
    <Card className={`dark:bg-secondary-color border border-zinc-600 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">Transaction Summary</CardTitle>
          <div className="flex bg-zinc-900 rounded-md p-1 gap-1">
            {(["7d", "1m", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2 py-0.5 text-[10px] rounded-sm transition-colors ${
                  timeRange === range
                    ? "bg-zinc-700 text-white font-medium shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {range === "7d"
                  ? "7 Days"
                  : range === "1m"
                  ? "1 Month"
                  : "All"}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div
              className={`flex-1 flex flex-col items-center justify-center border  py-2 rounded-md transition-colors cursor-pointer ${
                activeTab === "earned"
                  ? "bg-green-500/10 border-green-500"
                  : "border-zinc-700 hover:bg-zinc-800/50"
              }`}
              onClick={() => setActiveTab("earned")}
            >
              <span className="text-green-400 font-semibold text-lg">
                {summary.businessEarned} AC
              </span>
              <span className="text-zinc-400 text-xs">
                ₹{summary.businessEarned * 10}
              </span>
              <span className="text-xs font-semibold mt-1 text-zinc-500">
                Earned
              </span>
            </div>

            <div
              className={`flex-1 flex flex-col items-center justify-center border py-2 rounded-md transition-colors cursor-pointer ${
                activeTab === "spent"
                  ? "bg-red-500/10 border-red-500"
                  : "border-zinc-700 hover:bg-zinc-800/50"
              }`}
              onClick={() => setActiveTab("spent")}
            >
              <span className="text-red-500 font-semibold text-lg">
                {summary.businessSpent} AC
              </span>
              <span className="text-zinc-400 text-xs">
                ₹{summary.businessSpent * 10}
              </span>
              <span className="text-xs font-semibold mt-1 text-zinc-500">
                Spent
              </span>
            </div>
          </div>

          <div
            className={`w-full flex flex-col items-center justify-center border py-2 rounded-md transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "bg-blue-500/10 border-blue-400"
                : "border-zinc-700 hover:bg-zinc-800/50"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <span className="text-blue-400 font-semibold text-lg">
              {summary.netGain} AC
            </span>
            <span className="text-zinc-400 text-xs">
              ₹{summary.netGain * 10}
            </span>
            <span className="text-xs font-semibold mt-1 text-zinc-500">
              Net Gain
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-medium text-zinc-400 capitalize">
              Overview Chart
            </span>
          </div>
          <div className="h-[200px] w-full bg-zinc-900/30 rounded-lg border border-zinc-800/50 p-2">
             <WalletChart mode="composed" data={chartData.overview} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletSummaryStats;
