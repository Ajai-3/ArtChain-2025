import React from "react";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Search } from "lucide-react";

interface ArtFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  postType: string;
  onPostTypeChange: (value: string) => void;
  priceType: string;
  onPriceTypeChange: (value: string) => void;
}

const ArtFilters: React.FC<ArtFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  postType,
  onPostTypeChange,
  priceType,
  onPriceTypeChange,
}) => {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-950 border dark:border-zinc-800 p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
      <div className="relative w-full sm:w-auto sm:flex-1 min-w-[200px]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
        type="text"
          placeholder="Search arts..."
          value={search}
          variant="green-focus"
          onChange={(e) => onSearchChange(e.target.value)}
          className="px-8 w-full"
        />
      </div>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[150px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
          <SelectItem value="deleted">Deleted</SelectItem>
        </SelectContent>
      </Select>

      <Select value={postType} onValueChange={onPostTypeChange}>
        <SelectTrigger className="w-full sm:w-[150px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="original">Original</SelectItem>
          <SelectItem value="repost">Repost</SelectItem>
          <SelectItem value="purchased">Purchased</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priceType} onValueChange={onPriceTypeChange}>
        <SelectTrigger className="w-full sm:w-[150px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <SelectValue placeholder="All Prices" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Prices</SelectItem>
          <SelectItem value="artcoin">ArtCoin</SelectItem>
          <SelectItem value="fiat">Fiat</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ArtFilters;
