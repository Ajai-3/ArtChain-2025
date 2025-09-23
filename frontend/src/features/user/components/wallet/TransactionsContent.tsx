// src/components/wallet/TransactionsContent.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import TransactionsTable from "./TransactionsTable";

interface TransactionsContentProps {
  transactionSummary: Record<string, number>;
  transactions: { id: number; date: string; type: string; amount: number }[];
}

const TransactionsContent: React.FC<TransactionsContentProps> = ({
  transactionSummary,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Summary */}
      <div className="flex-1 flex flex-col gap-2">
        <Card className="dark:bg-secondary-color border border-zinc-600">
          <CardHeader>
            <CardTitle className="text-sm">This Month Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {/* Row with Earned & Spent */}
            <div className="flex gap-2">
              {/* Earned */}
              <div className="flex-1 flex flex-col items-center justify-center border border-green-400 dark:bg-secondary-color py-2">
                <span className="text-green-400 font-semibold text-lg">
                  {transactionSummary.earned} AC
                </span>
                <span className="text-zinc-400 text-xs">
                  ₹{transactionSummary.earned * 10}
                </span>
                <span className="text-xs font-semibold">Total Earned</span>
              </div>

              {/* Spent */}
              <div className="flex-1 flex flex-col items-center justify-center border border-red-500 dark:bg-secondary-color py-2">
                <span className="text-red-500 font-semibold text-lg">
                  {transactionSummary.spent} AC
                </span>
                <span className="text-zinc-400 text-xs">
                  ₹{transactionSummary.spent * 10}
                </span>
                <span className="text-xs font-semibold">Total Spent</span>
              </div>
            </div>

            {/* Full-width Net Gain */}
            <div className="w-full flex flex-col items-center justify-center border border-blue-400 dark:bg-blue-400/20 py-2">
              <span className="text-blue-400 font-semibold text-lg">
                {transactionSummary.netGain} AC
              </span>
              <span className="text-zinc-400 text-xs">
                ₹{transactionSummary.netGain * 10}
              </span>
              <span className="text-xs font-semibold">Tis months Net Gain</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        <Card className="dark:bg-secondary-color rounded-lg shadow-md flex-1 overflow-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsContent;
