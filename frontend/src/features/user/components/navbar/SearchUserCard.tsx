import React from "react";
import type { IndexedUser } from "../../../../types/IndexedUser";
import { User } from "lucide-react";

interface SearchUserCardProps {
  user: IndexedUser;
  onSelect: () => void;
}

const SearchUserCard: React.FC<SearchUserCardProps> = ({ user, onSelect }) => {

  return (
    <div className="flex items-center gap-3" onClick={onSelect}>
      {/* Profile image or default icon */}
      {user.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-700 text-white">
          <User className="w-6 h-6" />
        </div>
      )}

      {/* Name and username */}
      <div className="flex flex-col">
        <span className="font-medium text-white">{user.name}</span>
        <span className="text-zinc-400 text-sm">@{user.username}</span>
      </div>
    </div>
  );
};

export default SearchUserCard;
