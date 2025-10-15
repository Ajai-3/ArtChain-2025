import React, { useState } from "react";
import { X, ArrowDownRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  useGetLikedUsers,
  type LikedUser,
} from "../../hooks/art/useGetLikedUsers.ts";
import UserListSkeleton from "../skeletons/UserListSkeleton.tsx";
import { Button } from "../../../../components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { useGetSupporting } from "../../hooks/profile/useGetSupporting";
import { useSupportMutation } from "../../hooks/profile/useSupportMutation";
import { useUnSupportMutation } from "../../hooks/profile/useUnSupportMutation";
import CustomLoader from "../../../../components/CustomLoader";
import { formatNumber } from "../../../../libs/formatNumber.ts";

interface LikeUsersModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const LikeUsersModal: React.FC<LikeUsersModalProps> = ({
  postId,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const currentUserId = user?.id;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useGetLikedUsers(postId, isOpen);

  // Supporting query
  const currentUserSupportingQuery = useGetSupporting(currentUserId || "");
  const currentUserSupportingIds =
    currentUserSupportingQuery.data?.pages.flatMap((p) =>
      p.data.map((u) => u.id)
    ) || [];

  // Mutations
  const supportMutation = useSupportMutation();
  const unSupportMutation = useUnSupportMutation();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  if (!isOpen) return null;

  const allUsers = data?.pages.flatMap((page) => page.users) || [];

  const handleSupportClick = (
    e: React.MouseEvent,
    targetUser: { id: string; username: string },
    isSupporting: boolean
  ) => {
    e.stopPropagation();
    if (loadingUserId) return;
    setLoadingUserId(targetUser.id);

    const payload = { userId: targetUser.id, username: targetUser.username };

    if (isSupporting) {
      unSupportMutation.mutate(payload, {
        onSuccess: () => {
          setLoadingUserId(null);
          currentUserSupportingQuery.refetch();
        },
        onError: () => setLoadingUserId(null),
      });
    } else {
      supportMutation.mutate(payload, {
        onSuccess: () => {
          setLoadingUserId(null);
          currentUserSupportingQuery.refetch();
        },
        onError: () => setLoadingUserId(null),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative z-50 bg-white dark:bg-secondary-color border sm:dark:border-zinc-700 sm:rounded-3xl shadow-lg h-full sm:h-[500px] w-full sm:w-[470px] p-2 sm:p-4 flex flex-col">
        {/* close button */}
        <button
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-700 dark:hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* title + refetch button */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-300 dark:border-zinc-700">
          <h2 className="text-lg text-center font-bold">
            Likes ( {formatNumber(data?.pages?.[0]?.likeCount ?? 0)} )
          </h2>

          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="text-sm text-blue-500 pr-10 hover:text-blue-700 disabled:opacity-50"
          >
            {isRefetching ? "Refreshing..." : "Refetch"}
          </button>
        </div>

        {/* user list */}
        <ul className="flex-1 overflow-y-auto space-y-3 mt-2">
          {isLoading &&
            [...Array(5)].map((_, i) => <UserListSkeleton key={i} />)}
          {isError && (
            <p className="text-center text-red-500">Error fetching users.</p>
          )}
          {!isLoading && allUsers.length === 0 && (
            <p className="text-center text-gray-500">
              No one has liked this yet.
            </p>
          )}

          {allUsers.map((user: LikedUser) => {
            const isSupporting = currentUserSupportingIds.includes(user.userId);
            const isCurrentUser = currentUserId === user.userId;

            return (
              <li
                key={user.userId}
                onClick={() => {
                  onClose();
                  navigate(`/${user.username}`);
                }}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <div className="flex w-full justify-between items-center">
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.name || "Unknown User"}
                      </p>
                      <p className="text-zinc-400 dark:text-zinc-500 text-xs">
                        {formatDistanceToNow(new Date(user.likedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.username || "Unknown User"}
                    </p>
                  </div>

                  {/* hide support button for self */}
                  {!isCurrentUser && (
                    <div className="flex items-center gap-3">
                      <Button
                        variant={isSupporting ? "unSupport" : "support"}
                        size="support"
                        onClick={(e) =>
                          handleSupportClick(
                            e,
                            { id: user.userId, username: user.username || "" },
                            isSupporting
                          )
                        }
                        disabled={loadingUserId === user.userId}
                        className="relative flex items-center justify-center"
                      >
                        <span
                          className={`flex items-center gap-1 transition-opacity ${
                            loadingUserId === user.userId
                              ? "invisible"
                              : "visible"
                          }`}
                        >
                          {isSupporting ? (
                            <>
                              Supporting <ArrowDownRight size={14} />
                            </>
                          ) : (
                            "Support"
                          )}
                        </span>

                        {loadingUserId === user.userId && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <CustomLoader />
                          </span>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Load More button */}
        {hasNextPage && (
          <button
            className="mt-2 text-blue-500 hover:text-blue-700"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LikeUsersModal;
