import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../components/ui/select";
import { useState } from "react";
import { useGetWithdrawalRequests } from "../../hooks/wallet/useGetWithdrawalRequests";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Banknote,
  Smartphone,
} from "lucide-react";
import { Skeleton } from "../../../../components/ui/skeleton";

import { Pagination } from "./Pagination";

import { Button } from "../../../../components/ui/button";
import { Plus } from "lucide-react";
import WithdrawalModal from "./WithdrawalModal";

export default function WithdrawalsTable({ balance }: { balance: number }) {
  const STATUSES = ["PENDING", "APPROVED", "PROCESSING", "COMPLETED", "REJECTED", "FAILED"] as const;
  const METHODS = ["BANK_TRANSFER", "UPI"] as const;
  
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [method, setMethod] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading } = useGetWithdrawalRequests(page, 6, status, method);
  const withdrawals = data?.requests || [];
  const totalPages = data?.totalPages || 1;

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
      switch (status) {
        case "PENDING":
          return {
            color: "bg-yellow-700/20 text-yellow-500 border-yellow-700/30",
            icon: Clock,
          };
        case "APPROVED":
        case "PROCESSING":
          return {
            color: "bg-blue-700/20 text-blue-500 border-blue-700/30",
            icon: AlertCircle,
          };
        case "COMPLETED":
          return {
            color: "bg-green-700/20 text-green-500 border-green-700/30",
            icon: CheckCircle,
          };
        case "REJECTED":
        case "FAILED":
          return {
            color: "bg-red-700/20 text-red-500 border-red-700/30",
            icon: XCircle,
          };
        default:
          return {
            color: "bg-gray-700/20 text-gray-500 border-gray-700/30",
            icon: Clock,
          };
      }
    };

    const config = getStatusConfig(status);
    const IconComponent = config.icon;

    return (
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${config.color} w-28 justify-center`}
      >
        <IconComponent className="w-3 h-3" />
        <span>{status}</span>
      </div>
    );
  };

  const MethodBadge = ({ method }: { method: string }) => {
    const isBank = method === "BANK_TRANSFER";
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${
          isBank
            ? "bg-purple-700/20 text-purple-400 border-purple-700/30"
            : "bg-blue-700/20 text-blue-400 border-blue-700/30"
        } w-32 justify-center`}
      >
        {isBank ? (
          <Banknote className="w-3 h-3" />
        ) : (
          <Smartphone className="w-3 h-3" />
        )}
        <span>{isBank ? "Bank Transfer" : "UPI"}</span>
      </div>
    );
  };

  if (isLoading) {
      return (
      <div className="space-y-4">
        <div className="flex gap-4 justify-between">
          <div className="flex gap-4">
             <Skeleton className="w-32 h-10" />
             <Skeleton className="w-32 h-10" />
          </div>
          <Skeleton className="w-32 h-10" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4">
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1); 
              }}
            >
              <SelectTrigger className="w-32 bg-zinc-900 border-zinc-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="all" className="hover:bg-zinc-800">
                  All Status
                </SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="hover:bg-zinc-800">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={method}
              onValueChange={(v) => {
                setMethod(v);
                setPage(1); 
              }}
            >
              <SelectTrigger className="w-32 bg-zinc-900 border-zinc-700">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="all" className="hover:bg-zinc-800">
                   All Methods
                </SelectItem>
                {METHODS.map((m) => (
                  <SelectItem key={m} value={m} className="hover:bg-zinc-800">
                    {m === "BANK_TRANSFER" ? "Bank Transfer" : "UPI"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        <div className="flex items-center gap-4">
            <div className="text-xs text-gray-400 hidden md:block">
                 Page {page} of {totalPages}
            </div>
            <WithdrawalModal
                  trigger={
                    <Button variant="main" size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      New Request
                    </Button>
                  }
                  balance={balance}
            />
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700">
            <TableHead className="text-gray-400">Date / Time</TableHead>
            <TableHead className="text-gray-400">Amount</TableHead>
            <TableHead className="text-gray-400">Method</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals && withdrawals.length > 0 ? (
            withdrawals.map((withdrawal: any) => {
              const dateObj = new Date(withdrawal.createdAt);
              const date = dateObj.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const time = dateObj.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <TableRow
                  key={withdrawal.id}
                  className="border-zinc-800 hover:bg-zinc-900/50"
                >
                  <TableCell className="text-gray-300 font-mono text-sm">
                    <div className="flex flex-col">
                      <span>{date}</span>
                      <span className="text-xs text-gray-500">{time}</span>
                    </div>
                  </TableCell>

                  <TableCell className="flex flex-col font-semibold">
                    <span className="text-red-500">
                      -{withdrawal.amount} AC
                    </span>
                    <span className="text-xs text-gray-400">
                      ₹{withdrawal.amount * 10}
                    </span>
                  </TableCell>

                  <TableCell>
                    <MethodBadge method={withdrawal.method} />
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={withdrawal.status} />
                  </TableCell>

                  <TableCell className="max-w-xs">
                    <div className="flex flex-col gap-1">
                      {withdrawal.method === "BANK_TRANSFER" ? (
                        <span className="text-gray-400 text-sm truncate">
                          {withdrawal.accountNumber?.replace(/(\d{4})(?=\d)/g, "$1 ")}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm truncate">
                          {withdrawal.upiId}
                        </span>
                      )}
                      {withdrawal.rejectionReason && (
                        <span className="text-red-400 text-xs">
                          Reason: {withdrawal.rejectionReason}
                        </span>
                      )}
                      <button
                        onClick={() => copyToClipboard(withdrawal.id, withdrawal.id)}
                        className={`text-xs font-mono truncate max-w-full text-left transition-colors duration-200 ${
                          copiedId === withdrawal.id
                            ? "text-green-400"
                            : "text-blue-400 hover:text-blue-300"
                        }`}
                        title={
                          copiedId === withdrawal.id
                            ? "Copied!"
                            : "Click to copy Request ID"
                        }
                      >
                        {copiedId === withdrawal.id
                          ? "✓ Copied!"
                          : `ID: ${withdrawal.id.slice(0, 8)}...${withdrawal.id.slice(-8)}`}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <p className="text-gray-500">No withdrawal requests found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <Pagination
        page={page}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={setPage}
      />
    </div>
  );
}
