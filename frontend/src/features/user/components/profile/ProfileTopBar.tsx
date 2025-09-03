import React, { useState, useRef, useCallback } from "react";
import type { User } from "../../../../types/user/user";
import { ArrowDownRight, Ellipsis, X } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useSupportMutation } from "../../hooks/profile/useSupportMutation";
import { useUnSupportMutation } from "../../hooks/profile/useUnSupportMutation";
import { useGetSupporters } from "../../hooks/profile/useGetSupporters";
import { useGetSupporting } from "../../hooks/profile/useGetSupporting";
import { useNavigate } from "react-router-dom";

interface ProfileTopBarProps {
  user: User;
  isOwnProfile: boolean;
  supportingCount: number;
  supportersCount: number;
  isSupporting: boolean;
}

const ProfileTopBar: React.FC<ProfileTopBarProps> = ({
  user,
  isOwnProfile,
  supportingCount,
  supportersCount,
  isSupporting,
}) => {
  const supportMutation = useSupportMutation();
  const unSupportMutation = useUnSupportMutation();
  const navigate = useNavigate()

  const isMutating = supportMutation.isPending || unSupportMutation.isPending;

  const handleSupportClick = () => {
    if (!user?.id) return;
    if (isSupporting) unSupportMutation.mutate(user.id);
    else supportMutation.mutate(user.id);
  };

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "supporters" | "supporting" | null
  >(null);

  const openModal = (type: "supporters" | "supporting") => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  // Queries triggered only when modal opens
  // Inside ProfileTopBar
  const supportersQuery = useGetSupporters(
    user?.id,
    modalOpen && modalType === "supporters"
  );
  const supportingQuery = useGetSupporting(
    user?.id,
    modalOpen && modalType === "supporting"
  );

  // Intersection observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastUserRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (!node) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (modalType === "supporters" && supportersQuery.hasNextPage) {
            supportersQuery.fetchNextPage();
          } else if (
            modalType === "supporting" &&
            supportingQuery.hasNextPage
          ) {
            supportingQuery.fetchNextPage();
          }
        }
      });

      observerRef.current.observe(node);
    },
    [modalType, supportersQuery, supportingQuery]
  );

  // Flatten pages to a single array for the modal
  const modalUsers =
    modalType === "supporters"
      ? supportersQuery.data?.pages.flatMap((p) => p.data) ?? []
      : supportingQuery.data?.pages.flatMap((p) => p.data) ?? [];

  const isFetchingNext =
    modalType === "supporters"
      ? supportersQuery.isFetchingNextPage
      : supportingQuery.isFetchingNextPage;

  return (
    <div className="relative">
      {/* Top bar */}
      <div className="py-10 sm:py-20 px-6 relative overflow-hidden">
        {user?.bannerImage && (
          <img
            src={user.bannerImage}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/10"></div>

        <div className="relative z-10 flex items-center gap-6">
          {/* Profile image */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Profile info */}
          <div className="flex flex-col space-y-2 text-white">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">{user?.name}</h1>
              <p className="text-gray-200">@{user?.username}</p>
            </div>

            <div className="flex gap-4 cursor-pointer">
              <p onClick={() => openModal("supporters")}>
                {supportersCount} supporters
              </p>
              <p>|</p>
              <p onClick={() => openModal("supporting")}>
                {supportingCount} supporting
              </p>
            </div>

            {!isOwnProfile && (
              <div className="flex gap-4 items-center">
                <Button
                  variant={isSupporting ? "profileMessage" : "support"}
                  onClick={handleSupportClick}
                  disabled={isMutating}
                  className="relative flex items-center justify-center"
                >
                  <span
                    className={`${
                      isMutating ? "invisible" : ""
                    } flex items-center gap-1`}
                  >
                    {isSupporting ? (
                      <>
                        Supporting <ArrowDownRight />
                      </>
                    ) : (
                      "Support"
                    )}
                  </span>

                  {isMutating && (
                    <span className="absolute w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  )}
                </Button>

                <Button variant="profileMessage">Message</Button>
                <Ellipsis />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          <div className="relative z-50 bg-white dark:bg-secondary-color border border-zinc-700 rounded-3xl shadow-lg p-6 w-2/6 max-w-full">
            <button
              className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-700 dark:hover:text-white"
              onClick={closeModal}
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold mb-4">
              {modalType === "supporters" ? "Supporters" : "Supporting"}
            </h2>

            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {modalUsers.map((userItem, index) => {
                const isLast = index === modalUsers.length - 1;
                return (
                  <li
                    key={userItem.id}
                    ref={isLast ? lastUserRef : null}
                    className="p-2 rounded flex items-center gap-2"
                  >
                    {/* Profile image or fallback circle */}
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

                    {/* User info */}
                    <div>
                      <p className="font-medium">{userItem.name}</p>
                      <p className="text-sm text-gray-400">
                        @{userItem.username}
                      </p>
                    </div>

                    {/* View button */}
                    <button className="ml-auto px-4 py-2 rounded-full bg-white/10 text-white text-md hover:bg-white/15"  onClick={() => navigate(`/profile/${userItem.id}`)}>
                      View
                    </button>
                  </li>
                );
              })}
              {isFetchingNext && (
                <li className="text-center p-2 text-gray-500">Loading...</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTopBar;
