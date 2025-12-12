import React from "react";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

interface WalletFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  minBalance: string;
  setMinBalance: (value: string) => void;
  maxBalance: string;
  setMaxBalance: (value: string) => void;
}

const WalletFilters: React.FC<WalletFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  setStatusFilter,
  minBalance,
  setMinBalance,
  maxBalance,
  setMaxBalance,
}) => {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-950 border dark:border-zinc-800 p-4 rounded-lg mb-3">
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
        <Input
          type="text"
          placeholder="Search by name, email, or username..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="green-focus"
          className="w-full xl:w-1/3"
        />

        <div className="flex items-center gap-2 w-full xl:w-auto">
          <span className="text-sm text-zinc-500 whitespace-nowrap">Balance:</span>
          <Input
            type="number"
            placeholder="Min"
            value={minBalance}
            onChange={(e) => setMinBalance(e.target.value)}
            className="w-full sm:w-28"
          />
          <span className="text-zinc-400">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxBalance}
            onChange={(e) => setMaxBalance(e.target.value)}
            className="w-full sm:w-28"
          />
        </div>

        <div className="w-full xl:w-auto xl:ml-auto">
          <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
            <SelectTrigger className="w-full xl:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default WalletFilters;
