import React, { useRef, useCallback } from "react";
import { useGetSupporters } from "../../hooks/profile/useGetSupporters";
import { useGetSupporting } from "../../hooks/profile/useGetSupporting";
import { useNavigate } from "react-router-dom";

interface SupportUserListProps {
  type: "supporters" | "supporting";
  userId: string;
}

export const SupportUserList: React.FC<SupportUserListProps> = ({ type, userId }) => {
  const supportersQuery = useGetSupporters(userId, type === "supporters");
  const supportingQuery = useGetSupporting(userId, type === "supporting");
  const navigate = useNavigate();

  const query = type === "supporters" ? supportersQuery : supportingQuery;
  const users = query.data?.pages.flatMap((p) => p.data) ?? [];

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastUserRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (!node) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && query.hasNextPage) {
          query.fetchNextPage();
        }
      });

      observerRef.current.observe(node);
    },
    [query]
  );

  return (
    <ul className="space-y-2 max-h-80 overflow-y-auto">
      {users.map((userItem, index) => {
        const isLast = index === users.length - 1;
        return (
          <li
            key={userItem.id}
            ref={isLast ? lastUserRef : null}
            className="p-2 rounded flex items-center gap-2"
          >
            {userItem.profileImage ? (
              <img
                src={userItem.profileImage}
                alt={userItem.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center">
                <span className="text-white font-medium">
                  {userItem.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div>
              <p className="font-medium">{userItem.name}</p>
              <p className="text-sm text-gray-400">@{userItem.username}</p>
            </div>

            <button
              className="ml-auto px-4 py-2 rounded-full bg-white/10 text-white text-md hover:bg-white/15"
              onClick={() => navigate(`/profile/${userItem.id}`)}
            >
              View
            </button>
          </li>
        );
      })}

      {query.isFetchingNextPage && (
        <li className="text-center p-2 text-gray-500">Loading...</li>
      )}
    </ul>
  );
};
