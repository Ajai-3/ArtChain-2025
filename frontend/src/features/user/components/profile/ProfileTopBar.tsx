import React, { useState } from "react";
import { ArrowDownRight, Ellipsis, View, Upload, Trash2 } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useSupportMutation } from "../../hooks/profile/useSupportMutation";
import { useUnSupportMutation } from "../../hooks/profile/useUnSupportMutation";
import { SupportModal } from "./SupportModal";
import type { ProfileTopBarProps } from "../../../../types/users/profile/ProfileTopBarProps";

const ProfileTopBar: React.FC<ProfileTopBarProps> = ({
  user,
  isOwnProfile,
  supportingCount,
  supportersCount,
  isSupporting,
}) => {
  const supportMutation = useSupportMutation();
  const unSupportMutation = useUnSupportMutation();

  const isMutating = supportMutation.isPending || unSupportMutation.isPending;

  const handleSupportClick = () => {
    if (!user?.id) return;
    if (isSupporting) unSupportMutation.mutate(user.id);
    else supportMutation.mutate(user.id);
  };

  const [modalType, setModalType] = useState<
    "supporters" | "supporting" | null
  >(null);

  const iconButtonClasses =
    "p-2 bg-zinc-700/80 rounded-full transition cursor-pointer";

  return (
    <div className="relative">
      {/* Banner Section */}
      <div className="py-10 sm:py-20 px-6 relative overflow-hidden">
        {user?.bannerImage ? (
          <>
            <img
              src={user.bannerImage}
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 dark:bg-black/10"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-zinc-950">
            {/* Vertical lines */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_right,#1f1f23_0px,#1f1f23_2px,transparent_2px,transparent_40px)]"></div>
            {/* Horizontal lines */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#1f1f23_0px,#1f1f23_2px,transparent_2px,transparent_40px)]"></div>
          </div>
        )}

        {/* Banner Actions */}
        {isOwnProfile && (
          <div className="absolute bottom-4 right-4 flex gap-3 z-20">
            {user?.bannerImage ? (
              <>
                <div title="View Banner" className={iconButtonClasses}>
                  <View className="w-6 h-6 text-white" />
                </div>
                <div title="Delete Banner" className={iconButtonClasses}>
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
              </>
            ) : (
              <div
                title="Upload Banner"
                className={`flex items-center ${iconButtonClasses}`}
              >
                <Upload className="w-6 h-6 text-white" />
                <p className="ml-2 hidden md:block text-white text-md">
                  Upload
                </p>
              </div>
            )}
          </div>
        )}

        <div className="relative z-10 flex items-center gap-6 sm:h-28">
          {/* Profile image */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden relative group/profile">
            {user?.profileImage ? (
              <>
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {/* Profile Hover Actions */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover/profile:opacity-100 transition duration-300">
                  {isOwnProfile ? (
                    <>
                      <div
                        title="View Profile Picture"
                        className={iconButtonClasses}
                      >
                        <View className="w-5 h-5 text-white" />
                      </div>
                      <div
                        title="Delete Profile Picture"
                        className={iconButtonClasses}
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </div>
                    </>
                  ) : (
                    <div
                      title="View Profile Picture"
                      className={iconButtonClasses}
                    >
                      <View className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-zinc-500 dark:bg-zinc-800 flex items-center justify-center relative group/profile">
                <span className="text-7xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                {/* Upload if no profile image */}
                {isOwnProfile && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/profile:opacity-100 transition duration-300">
                    <div
                      title="Upload Profile Picture"
                      className={iconButtonClasses}
                    >
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile info */}
          <div className="flex flex-col space-y-2 text-white">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-200">@{user?.username}</p>
            </div>

            <div className="flex gap-4 cursor-pointer">
              <p onClick={() => setModalType("supporters")}>
                {supportersCount} supporters
              </p>
              <p>|</p>
              <p onClick={() => setModalType("supporting")}>
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
      {modalType && (
        <SupportModal
          type={modalType}
          userId={user.id}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
};

export default ProfileTopBar;
