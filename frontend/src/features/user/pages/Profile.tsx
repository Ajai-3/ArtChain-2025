import React from "react";
import { Outlet, useParams } from "react-router-dom";
import ProfileTopBar from "../components/profile/ProfileTopBar";
import ProfileSelectBar from "../components/profile/ProfileSelectBar";
import { useProfileData } from "../hooks/profile/useProfileData";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const { username } = useParams<{ username?: string }>();
  const {
    profileUser,
    isLoading,
    isOwnProfile,
    displaySupportingCount,
    displaySupportersCount,
    isSupporting,
  } = useProfileData(username);

  if (isLoading) return <ProfileSkeleton />;
  if (!profileUser) return <div>User not found</div>;

  return (
    <div className="w-full flex flex-col">
      <ProfileTopBar
        user={profileUser}
        supportingCount={displaySupportingCount}
        supportersCount={displaySupportersCount}
        isOwnProfile={isOwnProfile}
        isSupporting={isSupporting}
      />

      <ProfileSelectBar />

      <div className="flex-1 relative overflow-y-auto">
        <div
          className="absolute top-0 left-0 w-full h-full bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${profileUser.backgroundImage})`,
            backgroundAttachment: "fixed",
          }}
        />

        <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />

        <div className="relative p-4 mb-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
