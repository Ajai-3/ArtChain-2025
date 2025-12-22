import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { format } from "date-fns";
import TransactionTableSkeleton from "../skeletons/TransactionTableSkeleton";
import { useGetUserTransactions } from "../../hooks/walletManagement/useGetUserTransactions";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletId: string;
  userName: string;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  walletId,
  userName,
}) => {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const limit = 5;

  const { data, isLoading } = useGetUserTransactions({
    walletId,
    page,
    limit,
    filters: {
      type: typeFilter,
      category: categoryFilter,
      status: statusFilter,
      method: methodFilter,
    },
    enabled: isOpen,
  });

  const totalPages = data?.meta
    ? Math.ceil(data.meta.total / data.meta.limit)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[70vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transactions for {userName}</DialogTitle>
        </DialogHeader>

        <div className="bg-zinc-50/50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Type</label>
              <Select onValueChange={setTypeFilter} defaultValue={typeFilter}>
                <SelectTrigger className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credited">Credited</SelectItem>
                  <SelectItem value="debited">Debited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Category</label>
              <Select onValueChange={setCategoryFilter} defaultValue={categoryFilter}>
                <SelectTrigger className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="TOP_UP">Top Up</SelectItem>
                  <SelectItem value="SALE">Sale</SelectItem>
                  <SelectItem value="PURCHASE">Purchase</SelectItem>
                  <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                  <SelectItem value="COMMISSION">Commission</SelectItem>
                  <SelectItem value="REFUND">Refund</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</label>
              <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
                <SelectTrigger className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Method</label>
              <Select onValueChange={setMethodFilter} defaultValue={methodFilter}>
                <SelectTrigger className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="razorpay">Razorpay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>



        <div className="border rounded-md overflow-x-auto border-zinc-800">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-zinc-900">
                <TableHead className="px-4 py-2 text-left">Date</TableHead>
                <TableHead className="px-4 py-2 text-left">Type</TableHead>
                <TableHead className="px-4 py-2 text-left">Category</TableHead>
                <TableHead className="px-4 py-2 text-left">Amount (₹ / AC)</TableHead>
                <TableHead className="px-4 py-2 text-left">Method</TableHead>
                <TableHead className="px-4 py-2 text-left">Status</TableHead>
                <TableHead className="px-4 py-2 text-left">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TransactionTableSkeleton rows={limit} />
              ) : data?.data && data.data.length > 0 ? (
                data.data.map((tx: any) => (
                  <TableRow 
                    key={tx.id}
                    className="hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <TableCell className="whitespace-nowrap px-4 py-2">
                      {format(new Date(tx.createdAt), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.type === "credited"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2">{tx.category}</TableCell>
                    <TableCell
                      className={`font-medium px-4 py-2 ${
                        tx.type === "credited" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{tx.type === "credited" ? "+" : "-"} ₹{tx.amount.toFixed(2)}</span>
                        <span className="text-xs text-zinc-500">
                          AC {(tx.amount / 10).toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize px-4 py-2">{tx.method}</TableCell>
                    <TableCell className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === "success"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : tx.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate px-4 py-2" title={tx.description}>
                      {tx.description}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <span className="flex items-center text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsModal;
