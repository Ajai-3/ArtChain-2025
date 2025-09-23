import React from "react";
import DashboardContent from "../components/wallet/DashboardContent";
import TransactionsContent from "../components/wallet/TransactionsContent";
import { Coins } from "lucide-react";
import HorizontalTabs from "../components/wallet/HorizontalTabs";

const Wallet: React.FC = () => {
  const balance = 2500;
  const inrValue = 25000;

  const quickStats = { earned: 1250, spent: 850, avgTransaction: 125, roi: "92%", grade: "A" };
  const transactionSummary = { earned: 1250, spent: 850, netGain: 400 };
  const transactions = [
    { id: 1, date: "2025-09-01", type: "Earned", amount: 500 },
    { id: 2, date: "2025-09-02", type: "Spent", amount: 200 },
    { id: 3, date: "2025-09-03", type: "Earned", amount: 750 },
    { id: 4, date: "2025-09-04", type: "Spent", amount: 650 },
  ];

  return (
    <div className="p-2 sm:p-4 dark:text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-main-color/30 p-4 rounded-xl">
            <Coins className="text-main-color w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">ArtCoin</h1>
            <p className="dark:text-gray-400 text-sm">
              A next-generation digital token empowering creators and collectors.
            </p>
          </div>
        </div>
        
      </div>

      {/* Tabs */}
      <HorizontalTabs
        dashboardContent={<DashboardContent balance={balance} inrValue={inrValue} quickStats={quickStats} />}
        transactionsContent={<TransactionsContent transactionSummary={transactionSummary} transactions={transactions} />}
      />
    </div>
  );
};

export default Wallet;
