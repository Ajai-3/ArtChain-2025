// src/components/wallet/TransactionsContent.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import TransactionsTable from "./TransactionsTable";
import WalletSummaryStats from "./WalletSummaryStats";
import { useChartData } from "../../hooks/wallet/useChartData";

interface TransactionsContentProps {
  transactionSummary: Record<string, number>;
  transactions: { id: string | number; date: string; type: string; amount: number; category?: string }[];
}

const TransactionsContent: React.FC<TransactionsContentProps> = ({
  transactions,
}) => {
  const [timeRange, setTimeRange] = React.useState<"7d" | "1m" | "all">("1m");
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "earned" | "spent"
  >("overview");

  const { summary, chartData } = useChartData(transactions, timeRange);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 items-start h-full">
      <div className="flex-1 w-full">
        <Card className="dark:bg-secondary-color rounded-lg shadow-md h-full min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-2xl">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsTable />
          </CardContent>
        </Card>
      </div>

      <div className="w-full md:w-[360px] lg:w-[400px] shrink-0">
        <WalletSummaryStats 
          summary={summary}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          chartData={chartData}
        />
      </div>
    </div>
  );
};

export default TransactionsContent;
