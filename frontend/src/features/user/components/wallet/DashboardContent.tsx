// src/components/wallet/DashboardContent.tsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import TopUpModal from "./TopUpModal";
import CurrencyConverter from "./CurrencyConverter";

interface DashboardContentProps {
  balance: number;
  inrValue: number;
  quickStats: Record<string, string | number>;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  balance,
  inrValue,
  quickStats,
}) => {
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 flex flex-col gap-4">
        {/* Balance Card */}
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
              <Button className="bg-secondary-color w-full hover:bg-gray-600 text-white">
                - Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats + Currency Converter */}
        <div className="flex flex-col md:flex-row gap-4">
          <CurrencyConverter />

          <Card className="flex-1 dark:bg-secondary-color border border-zinc-600">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(quickStats).map(([key, value]) => (
                <div className="flex justify-between capitalize" key={key}>
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
                    {value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-2/4 flex flex-col gap-4">
        <Card className="dark:bg-secondary-color rounded-lg p-6 shadow-md flex-1">
          <CardHeader>
            <CardTitle>Portfolio Analytics</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-gray-400">
            Chart Placeholder
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
