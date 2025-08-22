import React from "react";
import type { User } from "../../../../types/user";
import { Button } from "../../../../components/ui/button";
import { ArrowDownRight, Ellipsis } from "lucide-react";
import {
  useSupportMutation,
  useUnSupportMutation,
} from "../../../../api/user/profile/mutations";

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

  // Combine loading states
  const isMutating = supportMutation.isPending || unSupportMutation.isPending;

  const handleSupportClick = () => {
    if (!user?.id) return;

    if (isSupporting) {
      unSupportMutation.mutate(user.id);
    } else {
      supportMutation.mutate(user.id);
    }
  };

  return (
    <div className="relative">
      <div className="py-10 sm:py-20 px-6 relative overflow-hidden">
        {user?.bannerImage && (
          <img
            src={user.bannerImage}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/30 dark:bg-black/10"></div>

        {/* Content container */}
        <div className="relative z-10 flex items-center gap-6">
          {/* Profile Image */}
          <div className="w-28 h-28 rounded-full overflow-hidden">
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

          {/* Profile Info */}
          <div className="flex flex-col space-y-2 text-white">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">{user?.name}</h1>
              <p className="text-gray-200">@{user?.username}</p>
            </div>

            <div className="flex gap-4">
              <p className="text-md">{supportersCount} supporters</p>
              <p>|</p>
              <p className="text-md">{supportingCount} supporting</p>
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

                <Button variant={"profileMessage"}>Message</Button>
                <Ellipsis />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTopBar;
