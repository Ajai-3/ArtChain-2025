import React from "react";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Filter } from "lucide-react";

interface WithdrawalStatusFilterProps {
  statusFilter: string;
  onFilterChange: (status: string) => void;
}

const STATUSES = [
  "ALL",
  "PENDING",
  "APPROVED",
  "PROCESSING",
  "COMPLETED",
  "REJECTED",
  "FAILED",
];

const WithdrawalStatusFilter: React.FC<WithdrawalStatusFilterProps> = ({
  statusFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex mb-4 items-center gap-3 bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
      <Filter className="w-5 h-5 text-gray-500" />
      <Label className="text-sm font-medium">Filter by Status:</Label>
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? "default" : "outline"}
            onClick={() => onFilterChange(status)}
            className={`${
              statusFilter === status
                ? "bg-main-color hover:bg-main-color/90"
                : ""
            }`}
          >
            {status}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WithdrawalStatusFilter;
