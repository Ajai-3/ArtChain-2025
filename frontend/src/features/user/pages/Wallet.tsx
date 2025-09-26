import React from "react";
import DashboardContent from "../components/wallet/DashboardContent";
import TransactionsContent from "../components/wallet/TransactionsContent";
import { Coins } from "lucide-react";
import HorizontalTabs from "../components/wallet/HorizontalTabs";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useGetWallet } from "../hooks/wallet/useGetWallet";

const Wallet: React.FC = () => {
  const wallet = useSelector((state: RootState) => state.wallet)

  const { data, isLoading, isError } = useGetWallet();

  // Optional: show loading or error state
  if (isLoading) return <p className="text-center mt-20">Loading wallet...</p>;
  // if (isError) return <p className="text-center mt-20 text-red-500">Failed to load wallet data.</p>;

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
        dashboardContent={<DashboardContent wallet={wallet} />}
        transactionsContent={<TransactionsContent transactionSummary={wallet.transactionSummary} transactions={wallet.transactions} />}
      />
    </div>
  );
};

export default Wallet;
