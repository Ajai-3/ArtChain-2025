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
import { useGetWalletChartData } from "../../hooks/wallet/useGetWalletChartData";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { formatNumber } from "../../../../libs/formatNumber";

interface DashboardContentProps {
  wallet: Wallet;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ wallet }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "1m" | "all">("all");
  const [activeTab, setActiveTab] = useState<"trend" | "breakdown" | "stats">("trend"); 

  const { balance } = wallet;
  const rate = useSelector((state: RootState) => state.platform.artCoinRate);
  const inrValue = balance * rate;
  const { data: chartData, isLoading: isChartLoading } = useGetWalletChartData(timeRange);

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-4">
          {/* ... (Balance Card Code same as before) ... */}
          <Card className="bg-main-color/20 border border-main-color rounded-lg p-0 shadow-md relative">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Balance{" "}
                  <span className="text-yellow-400 text-sm font-normal ml-2">★ Real-time</span>
                </CardTitle>
                <div className="flex flex-col items-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowBalance(!showBalance)}
                      className="h-6 w-6"
                    >
                      {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-3xl font-bold">
                        {showBalance ? `${formatNumber(balance)} AC` : "****"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {showBalance ? `≈ ₹${formatNumber(inrValue)} INR` : "****"}
                      </p>
                  </div>
                  <div className="text-right bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg">
                      <p className="text-xs text-amber-500/80 uppercase font-semibold">Locked Amount</p>
                      <p className="text-lg font-bold text-amber-500 tabular-nums">
                        {showBalance ? formatNumber(wallet.lockedAmount) : "****"} <span className="text-xs font-normal">AC</span>
                      </p>
                  </div>
              </div>
              <div className="flex gap-2">
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
                <p className="text-xs dark:text-zinc-400">
                   {timeRange === '7d' ? 'Last 7 Days' : timeRange === '1m' ? 'Last Month' : 'All Time'}
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {isChartLoading ? (
                   <div className="flex justify-center p-4"><Loader2 className="animate-spin h-4 w-4" /></div>
                ) : (
                  chartData?.stats.map((stat) => (
                    <div
                      className="flex justify-between capitalize border-b border-zinc-800 py-1"
                      key={stat.name}
                    >
                      <span>{stat.name}</span>
                      <span
                        className={
                          stat.name === "Earned"
                            ? "text-green-400"
                            : stat.name === "Spent"
                            ? "text-red-500"
                            : stat.name === "ROI"
                            ? "text-yellow-400"
                            : ""
                        }
                      >
                        {["Earned", "Spent", "Avg Tx"].includes(stat.name)
                          ? `${formatNumber(Number(stat.value))} AC`
                          : stat.name === "Grade"
                          ? stat.value
                          : `${stat.value}%`}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: ALL CHARTS IN ONE BOX */}
        <div className="w-full md:w-2/4 flex flex-col min-h-[400px]">
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
               {isChartLoading ? (
                 <div className="w-full h-full flex items-center justify-center">
                   <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                 </div>
               ) : (
                 <>
                   {activeTab === "trend" && (
                      <WalletChart mode="trend" data={chartData?.trend || []} />
                   )}

                   {activeTab === "breakdown" && (
                      <div className="flex flex-row w-full h-full gap-2">
                         <div className="flex-1 flex flex-col items-center">
                            <span className="text-sm font-medium text-green-400 mb-2">Total Credited</span>
                            <div className="flex-1 w-full min-h-[200px]">
                               <WalletChart mode="breakdown" activeSubTab="earned" data={chartData?.breakdown.earned || []} />
                            </div>
                         </div>
                         <div className="w-[1px] bg-zinc-800 my-4"></div>
                         <div className="flex-1 flex flex-col items-center">
                            <span className="text-sm font-medium text-red-500 mb-2">Total Debited</span>
                            <div className="flex-1 w-full min-h-[200px]">
                                <WalletChart mode="breakdown" activeSubTab="spent" data={chartData?.breakdown.spent || []} />
                            </div>
                         </div>
                      </div>
                   )}
                 </>
               )}

               {activeTab === "stats" && (
                   <div className="w-full h-full flex flex-col items-center justify-center">
                       <div className="w-full h-full min-h-[250px]">
                          <WalletChart mode="stats" data={chartData?.stats.filter(s => typeof s.value === 'number') || []} />
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
