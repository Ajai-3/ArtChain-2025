import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Button } from "../../../../components/ui/button";
import { Eye } from "lucide-react";
import { formatNumber } from "../../../../libs/formatNumber";
import WithdrawalTableSkeleton from "../skeletons/WithdrawalTableSkeleton";

interface WithdrawalTableProps {
  withdrawals: any[];
  onViewDetails: (withdrawal: any) => void;
  isLoading: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (ids: string[]) => void;
}


const WithdrawalTable: React.FC<WithdrawalTableProps> = ({
  withdrawals,
  onViewDetails,
  isLoading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-600/20 text-yellow-600";
      case "APPROVED":
      case "PROCESSING":
        return "bg-blue-600/20 text-blue-600";
      case "COMPLETED":
        return "bg-green-600/20 text-green-600";
      case "REJECTED":
      case "FAILED":
        return "bg-red-600/20 text-red-600";
      default:
        return "bg-gray-600/20 text-gray-600";
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onToggleSelectAll(withdrawals.map((w) => w.id));
    } else {
      onToggleSelectAll([]);
    }
  };

  const allSelected = 
    withdrawals && 
    withdrawals.length > 0 && 
    withdrawals.every((w) => selectedIds.includes(w.id));

  return (
     <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-zinc-900/50">
            <TableHead className="w-[50px] px-4 py-3">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-main-color focus:ring-main-color w-4 h-4 cursor-pointer accent-main-color"
                checked={allSelected}
                onChange={handleSelectAll}
                disabled={isLoading || !withdrawals || withdrawals.length === 0}
              />
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium">User</TableHead>
            <TableHead className="px-4 py-3 text-left font-medium">Request ID</TableHead>
            <TableHead className="px-4 py-3 text-left font-medium">Amount</TableHead>
            <TableHead className="px-4 py-3 text-left font-medium">Method</TableHead>
            <TableHead className="px-4 py-3 text-left font-medium">Status</TableHead>
            <TableHead className="px-4 py-3 text-left font-medium">Date</TableHead>
            <TableHead className="px-4 py-3 text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <WithdrawalTableSkeleton rows={6} />
          ) : withdrawals && withdrawals.length > 0 ? (
            withdrawals.map((withdrawal: any) => {
              const isSelected = selectedIds.includes(withdrawal.id);
              return (
                <TableRow
                  key={withdrawal.id}
                  className={`hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${
                    isSelected ? "bg-main-color/5 dark:bg-main-color/10" : ""
                  }`}
                >
                  <TableCell className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-main-color focus:ring-main-color w-4 h-4 cursor-pointer accent-main-color"
                      checked={isSelected}
                      onChange={() => onToggleSelect(withdrawal.id)}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {withdrawal.user?.profileImage ? (
                        <img
                          src={withdrawal.user.profileImage}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-zinc-800"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-700 dark:bg-zinc-600 flex items-center justify-center text-white font-bold ring-2 ring-gray-100 dark:ring-zinc-800 shrink-0">
                          {(withdrawal.user?.name || withdrawal.userId || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                            {withdrawal.user?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                           {withdrawal.user?.username}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {withdrawal.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100">
                    {formatNumber(withdrawal.amount)} AC
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">
                    {withdrawal.method === "BANK_TRANSFER"
                      ? "Bank Transfer"
                      : "UPI"}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                       className={`inline-block w-24 text-center py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(withdrawal.status)}`}
                    >
                      {withdrawal.status.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-sm">
                    {withdrawal.createdAt ? (
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-gray-200">{format(new Date(withdrawal.createdAt), "MMM d, yyyy")}</span>
                        <span className="text-xs text-gray-400">{format(new Date(withdrawal.createdAt), "hh:mm a")}</span>
                      </div>
                    ): "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(withdrawal)}
                      className="h-8 px-2 lg:px-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center justify-center p-4">
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">No withdrawal requests found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">New withdrawal requests will appear here.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WithdrawalTable;
