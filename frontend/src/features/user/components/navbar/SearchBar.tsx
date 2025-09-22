import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { useDebounce } from "../../../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import UnifiedSearchResults from "./UnifiedSearchResults";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const navigate = useNavigate();
  const currentUserId = useSelector((state: RootState) => state.user.user?.id);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelectUser = (username: string) => {
    setQuery("");
    setIsFocused(false);
    navigate(`/${username}`);
  };

  const handleSelectArt = (artName: string, username: string) => {
    setQuery("");
    setIsFocused(false);
    navigate(`/${username}/art/${artName}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full sm:w-1/3">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          type="text"
          variant="search"
          className="pl-9 pr-3 text-zinc-400 bg-transparent border-zinc-700 focus:border-main-color w-full"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
      </div>

      {/* Results */}
      {isFocused && query.trim() && (
        <UnifiedSearchResults
          query={debouncedQuery}
          onSelectUser={handleSelectUser}
          onSelectArt={handleSelectArt}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default SearchBar;
