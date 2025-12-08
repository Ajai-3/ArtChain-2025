// TransactionsTable.tsx
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
import { useGetTransactions } from "../../hooks/wallet/useGetTransactions";
import {
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Zap,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Pagination } from "./Pagination";

export default function TransactionsTable() {
  const METHODS = ["stripe", "razorpay"] as const;
  const TYPES = ["credited", "debited"] as const;
  const STATUSES = ["success", "failed", "pending"] as const;
  const CATEGORIES = [
    "TOP_UP",
    "SALE",
    "PURCHASE",
    "WITHDRAWAL",
    "COMMISSION",
    "REFUND",
    "OTHER",
  ] as const;

  type Filters = {
    method?: (typeof METHODS)[number];
    type?: (typeof TYPES)[number];
    category?: (typeof CATEGORIES)[number];
    status?: "success" | "failed" | "pending";
  };

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data } = useGetTransactions(page, 5, filters);
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

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
      switch (status.toLowerCase()) {
        case "success":
          return {
            color: "bg-green-700/20 text-green-500 border-green-700/30",
            icon: CheckCircle,
          };
        case "failed":
          return {
            color: "bg-red-700/20 text-red-500 border-red-700/30",
            icon: XCircle,
          };
        case "pending":
          return {
            color: "bg-yellow-700/20 text-yellow-500 border-yellow-700/30",
            icon: Clock,
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
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${config.color} w-24 justify-center`}
      >
        <IconComponent className="w-3 h-3" />
        <span>{status}</span>
      </div>
    );
  };

  const TypeBadge = ({ type }: { type: string }) => {
    const isCredited = type.toLowerCase() === "credited";
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${
          isCredited
            ? "bg-green-700/20 text-green-500 border-green-500/30"
            : "bg-red-700/20 text-red-500 border-red-500/30"
        } w-24 justify-center`}
      >
        {isCredited ? (
          <ArrowDown className="w-3 h-3" />
        ) : (
          <ArrowUp className="w-3 h-3" />
        )}
        <span>{type}</span>
      </div>
    );
  };

  const MethodBadge = ({ method }: { method: string }) => {
    const getMethodConfig = (method: string) => {
      switch (method.toLowerCase()) {
        case "stripe":
          return {
            color: "bg-purple-700/20 text-purple-400 border-purple-700/30",
            icon: CreditCard,
          };
        case "razorpay":
          return {
            color: "bg-blue-700/20 text-blue-400 border-blue-700/30",
            icon: Zap,
          };
        default:
          return {
            color: "bg-gray-700/20 text-gray-400 border-gray-700/30",
            icon: CreditCard,
          };
      }
    };
    const config = getMethodConfig(method);
    const IconComponent = config.icon;
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${config.color} w-24 justify-center`}
      >
        <IconComponent className="w-3 h-3" />
        <span>{method}</span>
      </div>
    );
  };

  const CategoryBadge = ({ category }: { category: string }) => {
    const getCategoryColor = (category: string) => {
      switch (category) {
        case "TOP_UP":
          return "bg-blue-700/20 text-blue-400 border-blue-700/30";
        case "SALE":
          return "bg-green-700/20 text-green-400 border-green-700/30";
        case "PURCHASE":
          return "bg-orange-700/20 text-orange-400 border-orange-700/30";
        case "WITHDRAWAL":
          return "bg-red-700/20 text-red-400 border-red-700/30";
        case "COMMISSION":
          return "bg-purple-700/20 text-purple-400 border-purple-700/30";
        case "REFUND":
          return "bg-yellow-700/20 text-yellow-400 border-yellow-700/30";
        default:
          return "bg-gray-700/20 text-gray-400 border-gray-700/30";
      }
    };
    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getCategoryColor(
          category
        )} w-24 justify-center`}
      >
        {category.replace("_", " ")}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              type: v === "all" ? undefined : (v as Filters["type"]),
            }))
          }
        >
          <SelectTrigger className="w-32 bg-zinc-900 border-zinc-700">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="all" className="hover:bg-zinc-800">
              All
            </SelectItem>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t} className="hover:bg-zinc-800">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              method: v === "all" ? undefined : (v as Filters["method"]),
            }))
          }
        >
          <SelectTrigger className="w-32 bg-zinc-900 border-zinc-700">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="all" className="hover:bg-zinc-800">
              All
            </SelectItem>
            {METHODS.map((m) => (
              <SelectItem key={m} value={m} className="hover:bg-zinc-800">
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              status: v === "all" ? undefined : (v as Filters["status"]),
            }))
          }
        >
          <SelectTrigger className="w-32 bg-zinc-900 border-zinc-700">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="all" className="hover:bg-zinc-800">
              All
            </SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="hover:bg-zinc-800">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              category: v === "all" ? undefined : (v as Filters["category"]),
            }))
          }
        >
          <SelectTrigger className="w-32 bg-zinc-900 border-zinc-700">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="all" className="hover:bg-zinc-800">
              All
            </SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="hover:bg-zinc-800">
                {c.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700">
            <TableHead className="text-gray-400">Date / Time</TableHead>
            <TableHead className="text-gray-400">Type</TableHead>
            <TableHead className="text-gray-400">Amount</TableHead>
            <TableHead className="text-gray-400">Method</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Category</TableHead>
            <TableHead className="text-gray-400">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.transactions?.map((tx) => {
            const dateObj = new Date(tx.createdAt);
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

            const acAmount = tx.amount;
            const inrAmount = acAmount * 10;

            return (
              <TableRow
                key={tx.id}
                className="border-zinc-800 hover:bg-zinc-900/50"
              >
                <TableCell className="text-gray-300 font-mono text-sm">
                  <div className="flex flex-col">
                    <span>{date}</span>
                    <span className="text-xs text-gray-500">{time}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <TypeBadge type={tx.type} />
                </TableCell>

                <TableCell className="flex flex-col font-semibold">
                  <span
                    className={
                      tx.type.toLowerCase() === "credited"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {tx.type.toLowerCase() === "credited" ? "+" : "-"}
                    {acAmount} AC
                  </span>
                  <span className="text-xs text-gray-400">₹{inrAmount}</span>
                </TableCell>

                <TableCell>
                  <MethodBadge method={tx.method} />
                </TableCell>

                <TableCell>
                  <StatusBadge status={tx.status} />
                </TableCell>

                <TableCell>
                  <CategoryBadge category={tx.category} />
                </TableCell>

                <TableCell className="max-w-xs">
                  <div className="flex flex-col gap-1">
                    <span
                      className="text-gray-400 truncate"
                      title={tx.description || "No description"}
                    >
                      {tx.description || "-"}
                    </span>
                    <button
                      onClick={() => copyToClipboard(tx.id, tx.id)}
                      className={`text-xs font-mono truncate max-w-full text-left transition-colors duration-200 ${
                        copiedId === tx.id
                          ? "text-green-400"
                          : "text-blue-400 hover:text-blue-300"
                      }`}
                      title={
                        copiedId === tx.id
                          ? "Copied!"
                          : "Click to copy Transaction ID"
                      }
                    >
                      {copiedId === tx.id
                        ? "✓ Copied!"
                        : `ID: ${tx.id.slice(0, 8)}...${tx.id.slice(-8)}`}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Pagination 
        page={page} 
        totalPages={totalPages} 
        isLoading={false} 
        onPageChange={setPage} 
      />
    </div>
  );
}
