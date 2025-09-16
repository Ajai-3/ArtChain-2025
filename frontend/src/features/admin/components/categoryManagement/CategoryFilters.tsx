import React from "react";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Button } from "../../../../components/ui/button";
import { SquarePen } from "lucide-react";

interface CategoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  useCountFilter: string;
  setUseCountFilter: (value: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  setStatusFilter,
  useCountFilter,
  setUseCountFilter,
}) => {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg mb-3 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        variant="green-focus"
        className="w-full"
      />

      {/* Status Filter */}
      <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {/* Use Count Filter */}
      <Select onValueChange={setUseCountFilter} defaultValue={useCountFilter}>
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="Use Count" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="low">Low (&lt; 20)</SelectItem>
          <SelectItem value="medium">Medium (20–50)</SelectItem>
          <SelectItem value="high">High (&gt; 50)</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="green">
        <SquarePen /> Create Category
      </Button>
    </div>
  );
};

export default CategoryFilters;
