import React, { useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { ArrowDownRight } from "lucide-react";
import { useSupportMutation } from "../../hooks/profile/useSupportMutation";
import { useUnSupportMutation } from "../../hooks/profile/useUnSupportMutation";
import { useGetSupporters } from "../../hooks/profile/useGetSupporters";
import { useGetSupporting } from "../../hooks/profile/useGetSupporting";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { useRemoveSupporterMutation } from "../../hooks/profile/useRemoveSupporterMutation";
import CustomLoader from "../../../../components/CustomLoader";

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
  const user = useSelector((state: RootState) => state.user.user);
  const currentUserId = user?.id;

  const supportersQuery = useGetSupporters(userId, type === "supporters");
  const supportingQuery = useGetSupporting(userId, type === "supporting");
  const query = type === "supporters" ? supportersQuery : supportingQuery;

  const users = query.data?.pages.flatMap((p) => p.data) ?? [];

  const currentUserSupportingQuery = useGetSupporting(currentUserId || "");
  const currentUserSupportingIds =
    currentUserSupportingQuery.data?.pages.flatMap((p) =>
      p.data.map((u) => u.id)
    ) || [];

  const isOwnProfile = userId === currentUserId;
  const usersWithoutCurrent = users.filter((u) => u.id !== currentUserId);
  const currentUserInList = users.find((u) => u.id === currentUserId);

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

  const removeSupporterMutation = useRemoveSupporterMutation(userId);
  const handleRemoveSupporter = (
    e: React.MouseEvent<HTMLButtonElement>,
    supporterId: string
  ) => {
    e.stopPropagation();
    removeSupporterMutation.mutate(supporterId, {
      onSuccess: () => query.refetch(),
    });
  };

  const supportMutation = useSupportMutation();
  const unSupportMutation = useUnSupportMutation();

  const handleSupportClick = (targetUserId: string, isSupporting: boolean) => {
    if (loadingUserId) return;
    setLoadingUserId(targetUserId);

    if (isSupporting) {
      unSupportMutation.mutate(targetUserId, {
        onSuccess: () => {
          setLoadingUserId(null);
          currentUserSupportingQuery.refetch();
          query.refetch();
        },
        onError: () => setLoadingUserId(null),
      });
    } else {
      supportMutation.mutate(targetUserId, {
        onSuccess: () => {
          setLoadingUserId(null);
          currentUserSupportingQuery.refetch();
          query.refetch();
        },
        onError: () => setLoadingUserId(null),
      });
    }
  };

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  return (
    <ul className="space-y-2 max-h-80 overflow-y-auto">
      {/* Logged-in user on top */}
      {!isOwnProfile && currentUserInList && (
        <li className="p-2 rounded flex items-center gap-2 mx-2 cursor-default">
          {currentUserInList.profileImage ? (
            <img
              src={currentUserInList.profileImage}
              alt={currentUserInList.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
              <span className="text-white font-medium">
                {currentUserInList.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div>
            <p className="font-medium">{currentUserInList.name}</p>
            <p className="text-sm text-gray-400">
              @{currentUserInList.username}
            </p>
          </div>
        </li>
      )}

      {/* Other users */}
      {usersWithoutCurrent.map((user, index) => {
        const isLast = index === usersWithoutCurrent.length - 1;
        const isSupporting = currentUserSupportingIds.includes(user.id);

        return (
          <li
            key={user.id}
            ref={isLast ? lastUserRef : null}
            className="p-2 rounded flex items-center gap-2 mx-2 cursor-pointer"
            onClick={() => {
              onClose();
              navigate(`/${user?.username}`);
            }}
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </div>

            {/* Button logic */}
            {isOwnProfile && type === "supporters" ? (
              <button
                className="ml-auto px-4 py-[.4rem] rounded-lg bg-red-600 text-white text-sm flex items-center justify-center relative"
                onClick={(e) => handleRemoveSupporter(e, user.id)}
                disabled={removeSupporterMutation.isPending}
              >
                {/* Keep text invisible to preserve width */}
                <span
                  className={`transition-opacity ${
                    removeSupporterMutation.isPending ? "invisible" : "visible"
                  }`}
                >
                  Remove
                </span>

                {removeSupporterMutation.isPending && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <CustomLoader />
                  </span>
                )}
              </button>
            ) : (isOwnProfile && type === "supporting") || !isOwnProfile ? (
              <Button
                variant={isSupporting ? "unSupport" : "support"}
                size="support"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSupportClick(user.id, isSupporting);
                }}
                disabled={loadingUserId === user.id}
                className="relative flex items-center justify-center ml-auto"
              >
                <span
                  className={`flex items-center gap-1 transition-opacity ${
                    loadingUserId === user.id ? "invisible" : "visible"
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

                {loadingUserId === user.id && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <CustomLoader />
                  </span>
                )}
              </Button>
            ) : null}
          </li>
        );
      })}

      {query.isFetchingNextPage && (
        <li className="text-center p-2 flex justify-center">
          <CustomLoader size={24} />
        </li>
      )}

      {users.length === 0 && !query.isFetching && (
        <li className="text-center p-2 text-gray-500">No users found</li>
      )}
    </ul>
  );
};
