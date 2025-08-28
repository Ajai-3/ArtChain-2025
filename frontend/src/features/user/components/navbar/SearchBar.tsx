import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { useSearchUsers } from "../../../../api/user/search/queries";
import UserSearchResults from "./UserSearchResults";
import { useDebounce } from "../../../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data: users = [], isLoading } = useSearchUsers(debouncedQuery);

  const navigate = useNavigate();

  const handleSelectUser = (userId: string) => {
    setQuery("");
    navigate(`/profile/${userId}`);
  };

  const currentUserId = useSelector((state: RootState) => state.user.user?.id);

  const filteredUsers = users.filter((user) => user.id !== currentUserId);

  return (
    <div className="relative w-1/4 hidden sm:block">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
      <Input
        type="text"
        variant="search"
        className="pl-9 pr-3 text-zinc-400 bg-transparent border-zinc-700 focus:border-main-color"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <UserSearchResults
        users={filteredUsers}
        isLoading={isLoading}
        query={debouncedQuery}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
};

export default SearchBar;
