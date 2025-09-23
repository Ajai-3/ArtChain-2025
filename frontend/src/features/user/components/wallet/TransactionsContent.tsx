// src/components/wallet/TransactionsContent.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";

interface TransactionsContentProps {
  transactionSummary: Record<string, number>;
  transactions: { id: number; date: string; type: string; amount: number }[];
}

const TransactionsContent: React.FC<TransactionsContentProps> = ({ transactionSummary, transactions }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Summary */}
      <div className="flex-1 flex flex-col gap-4">
        <Card className="bg-secondary-color border border-zinc-600">
          <CardHeader><CardTitle>This Month Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(transactionSummary).map(([key, value]) => (
              <div className="flex justify-between capitalize" key={key}>
                <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className={
                  key === "earned" ? "text-green-400" :
                  key === "spent" ? "text-red-500" :
                  key === "netGain" ? "text-yellow-400" : ""
                }>{value} AC</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        <Card className="bg-secondary-color rounded-lg shadow-md flex-1 overflow-auto">
          <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
          <CardContent>
            <Table className="bg-secondary-color">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-gray-700">
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.amount} AC</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsContent;
