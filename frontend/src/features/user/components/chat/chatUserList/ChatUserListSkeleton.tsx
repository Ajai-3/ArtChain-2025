import React from "react";
import { Skeleton } from "../../../../../components/ui/skeleton";

interface ChatUserListSkeletonProps {
  count?: number;
}

const ChatUserListSkeleton: React.FC<ChatUserListSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="flex flex-col gap-1 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/40 animate-pulse border border-zinc-800/30">
          {/* Avatar Skeleton */}
          <Skeleton className="w-14 h-14 rounded-full bg-zinc-800 shrink-0" />
          
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex justify-between items-start">
              {/* Name Skeleton */}
              <Skeleton className="h-4 w-24 bg-zinc-800 rounded" />
              {/* Time Skeleton */}
              <Skeleton className="h-3 w-10 bg-zinc-800 rounded" />
            </div>
            
            <div className="flex justify-between items-center pr-1">
              {/* Last Message Skeleton */}
              <Skeleton className="h-3 w-3/4 bg-zinc-800/60 rounded" />
              {/* Unread Count Skeleton (occasional) */}
              {i % 3 === 0 && <Skeleton className="h-5 w-5 rounded-full bg-indigo-500/20" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatUserListSkeleton;
