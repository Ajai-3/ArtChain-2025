// src/components/wallet/DashboardContent.tsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import TopUpModal from "./TopUpModal";
import WithdrawalModal from "./WithdrawalModal";
import CurrencyConverter from "./CurrencyConverter";
import type { Wallet } from "../../hooks/wallet/useGetWallet";
import WalletChart from "./WalletChart"; 
import { useChartData } from "../../hooks/wallet/useChartData";

interface DashboardContentProps {
  wallet: Wallet;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ wallet }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "1m" | "all">("1m");
  const [activeTab, setActiveTab] = useState<"trend" | "breakdown" | "stats">("trend"); 

  const { balance, inrValue, quickStats } = wallet;
  const { chartData } = useChartData(wallet.transactions, timeRange);

  const statsData = [
    { name: 'Earned', value: quickStats.earned || 0 },
    { name: 'Spent', value: quickStats.spent || 0 },
    { name: 'Avg Tx', value: parseFloat(String(quickStats.avgTransaction || 0)) },
    { name: 'ROI', value: parseFloat(String(quickStats.roi || 0)) },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-4">
          <Card className="bg-main-color/20 border border-main-color rounded-lg p-0 shadow-md relative">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Balance{" "}
                  <span className="text-yellow-400 text-sm">★ Real-time</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-3xl font-bold">
                {showBalance ? `${balance} AC` : "****"}
              </p>
              <p className="text-gray-400 text-sm">
                {showBalance ? `≈ ₹${inrValue} INR` : "****"}
              </p>
              <div className="flex gap-2 mt-2">
                <TopUpModal
                  trigger={
                    <Button variant="main" className="w-full">
                      + Top Up
                    </Button>
                  }
                />
                <WithdrawalModal
                  balance={balance}
                  trigger={
                    <Button className="bg-secondary-color w-full hover:bg-gray-600 text-white">
                      - Withdraw
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 flex-1">
            <CurrencyConverter />
            <Card className="flex-1 dark:bg-secondary-color border border-zinc-600">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <p className="text-xs dark:text-zinc-400">This Month</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(quickStats).map(([key, value]) => (
                  <div
                    className="flex justify-between capitalize border-b border-zinc-800 py-1"
                    key={key}
                  >
                    <span>{key.replace(/([A-Z])/g, " $1")}</span>
                    <span
                      className={
                        key === "earned"
                          ? "text-green-400"
                          : key === "spent"
                          ? "text-red-500"
                          : key === "roi"
                          ? "text-yellow-400"
                          : ""
                      }
                    >
                      {["earned", "spent", "avgTransaction"].includes(key)
                        ? `${value} AC`
                        : value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: ALL CHARTS IN ONE BOX */}
        <div className="w-full md:w-2/4 flex flex-col">
          <Card className="dark:bg-secondary-color rounded-lg p-4 shadow-md flex-1 flex flex-col border border-zinc-600">
            <CardHeader className="p-0 pb-4">
              <div className="flex justify-between items-center mb-4">
                 <CardTitle>Activity Trend</CardTitle>
                  <div className="flex bg-zinc-900 rounded-md p-1 gap-1">
                    {(["7d", "1m", "all"] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                          timeRange === range
                            ? "bg-zinc-700 text-white font-medium shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {range === "7d" ? "7 Days" : range === "1m" ? "1 Month" : "All Time"}
                      </button>
                    ))}
                  </div>
              </div>

               <div className="flex bg-zinc-900/50 p-1 rounded-lg w-full mb-2">
                  <button
                    onClick={() => setActiveTab("trend")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                       activeTab === "trend"
                        ? "bg-main-color text-white shadow" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Trend
                  </button>
                  <button
                    onClick={() => setActiveTab("breakdown")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                       activeTab === "breakdown"
                        ? "bg-main-color text-white shadow" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab("stats")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                       activeTab === "stats"
                        ? "bg-main-color text-white shadow" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Quick Stats
                  </button>
               </div>
            </CardHeader>
            
            <CardContent className="flex-1 min-h-[300px] p-0 relative">
               {activeTab === "trend" && (
                  <WalletChart mode="trend" data={chartData.trend} />
               )}

               {activeTab === "breakdown" && (
                  <div className="flex flex-row w-full h-full gap-2">
                     <div className="flex-1 flex flex-col items-center">
                        <span className="text-sm font-medium text-green-400 mb-2">Total Credited</span>
                        <div className="flex-1 w-full min-h-[200px]">
                           <WalletChart mode="breakdown" activeSubTab="earned" data={chartData.allCredited} />
                        </div>
                     </div>
                     <div className="w-[1px] bg-zinc-800 my-4"></div>
                     <div className="flex-1 flex flex-col items-center">
                        <span className="text-sm font-medium text-red-500 mb-2">Total Debited</span>
                        <div className="flex-1 w-full min-h-[200px]">
                            <WalletChart mode="breakdown" activeSubTab="spent" data={chartData.allDebited} />
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === "stats" && (
                   <div className="w-full h-full flex flex-col items-center justify-center">
                       <div className="w-full h-full min-h-[250px]">
                          <WalletChart mode="stats" data={statsData} />
                       </div>
                   </div>
               )}

            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default DashboardContent;
