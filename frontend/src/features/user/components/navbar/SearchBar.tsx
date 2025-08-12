import React from "react";
import { Search } from "lucide-react";
import { Input } from "../../../../components/ui/input";

const SearchBar: React.FC = () => {
  return (
    <div className="relative w-1/4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
      <Input
        type="text"
        variant="search"
        className="pl-9 pr-3 text-zinc-400 bg-transparent border-zinc-700 focus:border-main-color"
        placeholder="Search users..."
      />
    </div>
  );
};

export default SearchBar;