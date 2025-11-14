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
import { useRemoveSupporter } from "../../hooks/profile/useRemoveSuppoter";
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
  const currentUserId = useSelector((s: RootState) => s.user.user?.id);

  const query =
    type === "supporters"
      ? useGetSupporters(userId, true)
      : useGetSupporting(userId, true);

  const users = query.data?.pages.flatMap((p) => p.data) ?? [];

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

  const removeSupporterMutation = useRemoveSupporter();
  const supportMutation = useSupportMutation();
  const unSupportMutation = useUnSupportMutation();

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  const handleSupportClick = (user: any) => {
    if (loadingUserId) return;
    setLoadingUserId(user.id);

    const payload = { userId: user.id, username: user.username ?? "" };
    const mutation = user.isSupporting ? unSupportMutation : supportMutation;

    mutation.mutate(payload, {
      onSuccess: () => {
        setLoadingUserId(null);
        query.refetch();
      },
      onError: () => setLoadingUserId(null),
    });
  };

  return (
    <ul className="space-y-2 h-full sm:max-h-80 overflow-y-auto">
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

      {usersWithoutCurrent.map((user, index) => {
        const isLast = index === usersWithoutCurrent.length - 1;

        return (
          <li
            key={user.id}
            ref={isLast ? lastUserRef : null}
            className="p-2 rounded flex items-center gap-6 mx-2 cursor-pointer"
            onClick={() => {
              onClose();
              navigate(`/${user.username}`);
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

            {isOwnProfile && type === "supporters" ? (
              <button
                className="ml-auto px-4 py-[.4rem] rounded-lg bg-red-600 text-white text-sm relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setRemovingUserId(user.id);
                  removeSupporterMutation.mutate(
                    { supporterId: user.id, supporterUsername: user.username },
                    {
                      onSuccess: () => {
                        setRemovingUserId(null);
                        query.refetch();
                      },
                      onError: () => setRemovingUserId(null),
                    }
                  );
                }}
                disabled={removingUserId === user.id}
              >
                {removingUserId === user.id ? <CustomLoader /> : "Remove"}
              </button>
            ) : (
              <Button
                variant={user.isSupporting ? "unSupport" : "support"}
                size="support"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSupportClick(user);
                }}
                disabled={loadingUserId === user.id}
                className="ml-auto relative"
              >
                {loadingUserId === user.id ? (
                  <CustomLoader />
                ) : user.isSupporting ? (
                  <>
                    Supporting <ArrowDownRight size={14} />
                  </>
                ) : (
                  "Support"
                )}
              </Button>
            )}
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
