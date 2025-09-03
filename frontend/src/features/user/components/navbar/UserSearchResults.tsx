import React from "react";
import type { IndexedUser } from "../../../../types/user/IndexedUser";
import SearchUserCard from "./SearchUserCard";

interface UserSearchResultsProps {
  users: IndexedUser[];
  isLoading: boolean;
  query: string;
  onSelectUser: (userId: string) => void;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({
  users,
  isLoading,
  query,
  onSelectUser,
}) => {
  // Only show the box if user typed something
  if (!query.trim()) return null;

  return (
    <div className="absolute mt-1 w-full bg-white border border-zinc-800 dark:bg-secondary-color rounded shadow-lg max-h-64 min-h-72 overflow-auto z-50 scrollbar">
      {isLoading && (
        <div className="flex items-center justify-center h-full text-zinc-400">
          Loading...
        </div>
      )}

      {!isLoading && users.length === 0 && (
        <div className="flex items-center justify-center h-full text-zinc-400">
          No users found
        </div>
      )}

      {!isLoading && users.length > 0 && (
        <ul className="divide-y divide-zinc-900">
          {users.map((user) => (
            <li
              key={user.id}
              className="px-4 py-2 hover:bg-zinc-900 cursor-pointer"
            >
              <SearchUserCard
                user={user}
                onSelect={() => onSelectUser(user.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearchResults;
