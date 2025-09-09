import React, { useRef, useCallback } from "react";
import { useGetSupporters } from "../../hooks/profile/useGetSupporters";
import { useGetSupporting } from "../../hooks/profile/useGetSupporting";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../../api/axios";
import { Button } from "../../../../components/ui/button";
import { ArrowDownRight } from "lucide-react";
import { useSupportMutation } from "../../hooks/profile/useSupportMutation";
import { useUnSupportMutation } from "../../hooks/profile/useUnSupportMutation";

interface SupportUserListProps {
  type: "supporters" | "supporting";
  userId: string;
  onClose: () => void;
}

export const SupportUserList: React.FC<SupportUserListProps> = ({
  type,
  userId,
  onClose,
}) => {
  const navigate = useNavigate();

  const supportersQuery = useGetSupporters(userId, type === "supporters");
  const supportingQuery = useGetSupporting(userId, type === "supporting");
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

  const handleRemoveSupporter = async (supporterId: string) => {
    try {
      await apiClient.delete(`/api/v1/user/${userId}/supporters/${supporterId}`);
      query.refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const supportMutation = useSupportMutation();
  const unSupportMutation = useUnSupportMutation();
  const isMutating = supportMutation.isPending || unSupportMutation.isPending;

  const handleSupportClick = (targetUserId: string, isSupporting: boolean) => {
    if (isMutating) return;
    if (isSupporting) unSupportMutation.mutate(targetUserId);
    else supportMutation.mutate(targetUserId);
  };

  return (
    <ul className="space-y-2 max-h-80 overflow-y-auto">
      {users.map((user, index) => {
        const isLast = index === users.length - 1;
        const isSupporting = type === "supporting"; 

        return (
          <li
            key={user.id}
            ref={isLast ? lastUserRef : null}
            className="p-2 rounded flex items-center gap-2 mx-2 hover:bg-gray-100 dark:hover:bg-zinc-950 cursor-pointer"
            onClick={() => {
              onClose();
              navigate(`/profile/${user.id}`);
            }}
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </div>

            {type === "supporters" ? (
              <button
                className="ml-auto px-4 py-1 rounded-full bg-red-600 text-white text-sm hover:bg-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSupporter(user.id);
                }}
              >
                Remove
              </button>
            ) : (
              <Button
                variant={isSupporting ? "profileMessage" : "support"}
                onClick={(e) => {
                  e.stopPropagation(); // prevent modal row click
                  handleSupportClick(user.id, isSupporting);
                }}
                disabled={isMutating}
                className="relative flex items-center justify-center ml-auto"
              >
                <span className={`${isMutating ? "invisible" : ""} flex items-center gap-1`}>
                  {isSupporting ? (
                    <>
                      Supporting <ArrowDownRight size={14} />
                    </>
                  ) : (
                    "Support"
                  )}
                </span>

                {isMutating && (
                  <span className="absolute w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                )}
              </Button>
            )}
          </li>
        );
      })}

      {query.isFetchingNextPage && (
        <li className="text-center p-2 text-gray-500">Loading more...</li>
      )}

      {users.length === 0 && !query.isFetching && (
        <li className="text-center p-2 text-gray-500">No users found</li>
      )}
    </ul>
  );
};
