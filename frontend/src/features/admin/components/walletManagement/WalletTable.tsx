import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { User, FileText } from "lucide-react";
import WalletTableSkeleton from "../skeletons/WalletTableSkeleton";
import WalletStatusActions from "./WalletStatusActions";
import TransactionDetailsModal from "./TransactionDetailsModal";
import { format } from "date-fns";

interface WalletTableProps {
  wallets: any[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const WalletTable: React.FC<WalletTableProps> = ({
  wallets,
  isLoading,
  page,
  totalPages,
  limit,
  onPageChange,
}) => {
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openDetails = (wallet: any) => {
    setSelectedWallet(wallet);
    setIsDetailsOpen(true);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const visiblePages = 3;
    let startPage = Math.max(page - 1, 1);
    let endPage = Math.min(startPage + visiblePages - 1, totalPages);

    if (endPage - startPage < visiblePages - 1) {
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return (
      <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1}
          onClick={() => onPageChange(1)}
        >
          First
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>

        {startPage > 1 && <span className="px-2">...</span>}
        {pages.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === page ? "default" : "outline"}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
        {endPage < totalPages && <span className="px-2">...</span>}

        <Button
          size="sm"
          variant="outline"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-zinc-900">
              <TableHead className="px-2 py-2 text-left">No</TableHead>
              <TableHead className="px-4 py-2 text-left">User</TableHead>
              <TableHead className="px-4 py-2 text-left">Balance</TableHead>
              <TableHead className="px-4 py-2 text-left">Locked</TableHead>
              <TableHead className="px-4 py-2 text-left">Status</TableHead>
              <TableHead className="px-4 py-2 text-left">Last Transaction</TableHead>
              <TableHead className="px-4 py-2 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <WalletTableSkeleton rows={limit} />
            ) : wallets && wallets.length > 0 ? (
              wallets.map((wallet: any, idx: number) => (
                <TableRow
                  key={wallet.id}
                  className="hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                  <TableCell className="flex items-center gap-3 px-4 py-2">
                    {wallet.user?.profileImage ? (
                      <img
                        src={wallet.user.profileImage}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                        <User className="w-5 h-5 text-zinc-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{wallet.user?.name || "Unknown"}</p>
                      <p className="text-xs text-zinc-400">@{wallet.user?.username || "unknown"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 font-medium text-green-600">
                    ₹ {wallet.balance.toFixed(2)} <span className="text-xs text-zinc-500">(AC {(wallet.balance / 10).toFixed(2)})</span>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-zinc-500">
                    ₹ {wallet.lockedAmount.toFixed(2)} <span className="text-xs text-zinc-400">(AC {(wallet.lockedAmount / 10).toFixed(2)})</span>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        wallet.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : wallet.status === "locked"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {wallet.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    {wallet.lastTransaction ? (
                      <div className="text-xs">
                        <div className="flex items-center gap-1">
                          <span
                            className={
                              wallet.lastTransaction.type === "credited"
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {wallet.lastTransaction.type === "credited" ? "+" : "-"} ₹{" "}
                            {wallet.lastTransaction.amount.toFixed(2)}
                          </span>
                          <span className="text-zinc-500">
                            (AC {(wallet.lastTransaction.amount / 10).toFixed(2)})
                          </span>
                          <span className="text-zinc-500">
                            ({wallet.lastTransaction.category})
                          </span>
                        </div>
                        <div className="text-zinc-500">
                          {format(new Date(wallet.lastTransaction.createdAt), "MMM d, HH:mm")}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-500">No transactions</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <WalletStatusActions
                        walletId={wallet.id}
                        currentStatus={wallet.status}
                        userName={wallet.user?.name || "User"}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetails(wallet)}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                        title="View Transactions"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No wallets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {renderPagination()}

      {selectedWallet && (
        <TransactionDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          walletId={selectedWallet.id}
          userName={selectedWallet.user?.name || "User"}
        />
      )}
    </>
  );
};

export default WalletTable;
