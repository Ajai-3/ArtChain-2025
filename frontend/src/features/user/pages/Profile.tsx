import React from "react";
import { Outlet, useParams } from "react-router-dom";
import ProfileTopBar from "../components/profile/ProfileTopBar";
import ProfileSelectBar from "../components/profile/ProfileSelectBar";
import { useProfileData } from "../hooks/profile/useProfileData";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";

const Profile: React.FC = () => {
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
    <div className="w-full flex flex-col h-[calc(100vh-62px)] overflow-y-auto scrollbar">
      <ProfileTopBar
        user={profileUser}
        supportingCount={displaySupportingCount}
        supportersCount={displaySupportersCount}
        isOwnProfile={isOwnProfile}
        isSupporting={isSupporting}
      />
      <ProfileSelectBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
