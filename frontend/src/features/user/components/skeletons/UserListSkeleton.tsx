import React from "react";

const UserListSkeleton: React.FC = () => {
  return (
    <li className="flex items-center gap-3 animate-pulse w-full">
      {/* Profile circle */}
      <div className="w-10 h-10 rounded-full bg-zinc-300 dark:bg-zinc-800 shrink-0" />

      {/* Text placeholders */}
      <div className="flex justify-between items-center w-full px-2">
        <div className="flex flex-col gap-2 w-3/4">
          <div className="h-3 bg-zinc-300 dark:bg-zinc-800 rounded w-1/3" />
          <div className="h-3 bg-zinc-300 dark:bg-zinc-800 rounded w-1/4" />
        </div>
        <div className="h-3 p-4 bg-zinc-300 dark:bg-zinc-800 rounded w-1/5" />
      </div>
    </li>
  );
};

export default UserListSkeleton;
