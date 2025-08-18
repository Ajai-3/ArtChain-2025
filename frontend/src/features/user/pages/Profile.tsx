import { useState, useEffect } from "react";
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
import { setCurrentUser } from "../../../redux/slices/userSlice";

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("gallery");

  const { user: reduxUser } = useSelector((state: RootState) => state.user) as {
    user: User | null;
  };

  const { userId } = useParams<{ userId?: string }>();
  const isOwnProfile = !userId || reduxUser?.id === userId;

  const { data: apiUser, isLoading } = isOwnProfile
    ? useUserProfile()
    : useUserProfileWithId(userId!);

  console.log(apiUser);

  const profileUser: User | null = isOwnProfile
    ? apiUser?.user || reduxUser
    : apiUser?.user || null;

  useEffect(() => {
    if (isOwnProfile && apiUser) {
      dispatch(setCurrentUser(apiUser?.user));
    }
  }, [apiUser, dispatch, isOwnProfile]);

  if (isLoading || !profileUser) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-62px)]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-[calc(100vh-62px)]">
      <div className="flex-1 overflow-y-auto scrollbar relative">
        <ProfileTopBar user={profileUser} isOwnProfile={isOwnProfile} />
        <div className="sticky top-0 z-20 bg-white dark:bg-secondary-color">
          <ProfileSelectBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <ProfileContent activeTab={activeTab} user={profileUser} />
      </div>
    </div>
  );
};

export default Profile;
