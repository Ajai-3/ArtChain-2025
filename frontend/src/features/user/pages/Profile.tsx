import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { User } from "../../../types/user";
import type { RootState } from "../../../redux/store";
import ProfileTopBar from "../components/profile/ProfileTopBar";
import ProfileSelectBar from "../components/profile/ProfileSelectBar";
import ProfileContent from "../components/profile/ProfileContent";
import { useParams } from "react-router-dom";
import {
  useUserProfile,
  useUserProfileWithId,
} from "../../../api/user/profile/queries";
import {
  setCurrentUser,
  updateSupportersCount,
  updateSupportingCount,
} from "../../../redux/slices/userSlice";

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("gallery");

  const {
    user: reduxUser,
    supportingCount,
    supportersCount,
  } = useSelector((state: RootState) => state.user);

  const { userId } = useParams<{ userId?: string }>();

  const isOwnProfile = !userId || reduxUser?.id === userId;

  const { data: profileData, isLoading } = isOwnProfile
    ? useUserProfile()
    : useUserProfileWithId(userId ?? "");

  const profileUser: User | null = isOwnProfile
    ? profileData?.data?.user ?? reduxUser
    : profileData?.data?.user ?? null;


  const isSupporting = profileData?.data?.isSupporting || false;

  useEffect(() => {
    if (!profileUser) return;

    if (isOwnProfile) {
      dispatch(setCurrentUser(profileUser));
      dispatch(updateSupportingCount(profileData?.data?.supportingCount ?? 0));
      dispatch(updateSupportersCount(profileData?.data?.supportersCount ?? 0));
    }
  }, [profileUser, profileData, dispatch, isOwnProfile]);

  const displaySupportingCount = isOwnProfile
  ? supportingCount
  : profileData?.data?.supportingCount ?? 0;

const displaySupportersCount = isOwnProfile
  ? supportersCount
  : profileData?.data?.supportersCount ?? 0;

  if (isLoading) return <div>Loading profile...</div>;
  if (!profileUser) return <div>User not found</div>;

  

  return (
    <div className="w-full flex flex-col h-[calc(100vh-62px)]">
      <div className="flex-1 overflow-y-auto scrollbar relative">
        <ProfileTopBar
          user={profileUser}
          supportingCount={displaySupportingCount}
          supportersCount={displaySupportersCount}
          isOwnProfile={isOwnProfile}
          isSupporting={isSupporting}
        />
        <div className="sticky top-0 z-20 bg-white dark:bg-secondary-color">
          <ProfileSelectBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <ProfileContent activeTab={activeTab} user={profileUser} />
      </div>
    </div>
  );
};

export default Profile;
