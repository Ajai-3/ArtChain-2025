import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { useUnifiedSearch } from "../../hooks/search/useUnifiedSearch";

interface UnifiedSearchResultsProps {
  query: string;
  currentUserId?: string;
  onSelectUser: (username: string) => void;
onSelectArt: (artName: string, username: string) => void;
}

const UnifiedSearchResults: React.FC<UnifiedSearchResultsProps> = ({
  query,
  onSelectUser,
  onSelectArt,
  currentUserId,
}) => {
  const [tab, setTab] = useState<"user" | "art">("user");

  const { data: res, isLoading } = useUnifiedSearch(query, tab);

  // **Important:** Extract actual array from Axios response
  const results = Array.isArray(res) ? res : res?.data ?? [];

  const users = tab === "user" ? results.filter((u: any) => u.id !== currentUserId) : [];
  const arts = tab === "art" ? results : [];

  if (!query.trim()) return null;

  return (
    <div className="absolute mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg h-96 overflow-auto z-50 scrollbar">
      {/* Tabs */}
      <div className="flex border-b border-zinc-700">
        <button
          className={`flex-1 py-2 text-center font-medium ${
            tab === "user" ? "border-b-2 border-main-color text-white" : "text-zinc-400"
          }`}
          onClick={() => setTab("user")}
        >
          Users
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            tab === "art" ? "border-b-2 border-main-color text-white" : "text-zinc-400"
          }`}
          onClick={() => setTab("art")}
        >
          Arts
        </button>
      </div>

      {/* Loading */}
      {isLoading && <div className="p-4 text-center text-zinc-400">Loading...</div>}

      {/* No results */}
      {!isLoading && users.length === 0 && arts.length === 0 && (
        <div className="p-4 text-center text-zinc-400">No results found</div>
      )}

      {/* Users */}
      {!isLoading && tab === "user" && users.length > 0 && (
        <ul className="p-2">
          {users.map((user: any) => (
            <li
              key={user.id}
              onClick={() => onSelectUser(user.username)}
              className="flex items-center gap-3 px-2 py-2 hover:bg-zinc-800 cursor-pointer rounded-md transition-colors"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-main-color flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-white font-medium">{user.name}</span>
                <span className="text-zinc-400 text-sm">@{user.username}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Arts */}
      {!isLoading && tab === "art" && arts.length > 0 && (
        <ul className="p-2 grid grid-cols-1 gap-2">
          {arts.map((art: any) => (
            <li
              key={art.artNmae}
              onClick={() => onSelectArt(art.artname, art.username)}
              className="flex items-center gap-3 px-2 py-2 hover:bg-zinc-800 cursor-pointer rounded-md transition-colors"
            >
              <img
                src={art.imageUrl || "/placeholder.png"}
                alt={art.artname}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex flex-col">
                <span className="text-white font-medium">{art.artname || art.title}</span>
                <span className="text-zinc-400 text-sm">
                  {art.createdAt ? format(parseISO(art.createdAt), "dd MMM yyyy") : "-"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnifiedSearchResults;
