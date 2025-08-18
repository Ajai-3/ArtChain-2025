import { useState } from "react";
import { useSelector } from "react-redux";
import type { User } from "../../../types/user";
import type { RootState } from "../../../redux/store";
import ProfileTopBar from "../components/profile/ProfileTopBar";
import ProfileSelectBar from "../components/profile/ProfileSelectBar";
import ProfileContent from "../components/profile/ProfileContent";
import { useParams } from "react-router-dom";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("gallery");
  const { user } = useSelector((state: RootState) => state.user) as {
    user: User | null;
  };

  const { userId } = useParams<{ userId?: string }>();

  const isOwnProfile = !userId || user?.id === userId;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-62px)]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-[calc(100vh-62px)]">
      <div className="flex-1 overflow-y-auto scrollbar relative">
        <ProfileTopBar user={user} isOwnProfile={isOwnProfile} />

        <div className="sticky top-0 z-20 bg-white dark:bg-secondary-color">
          <ProfileSelectBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <ProfileContent activeTab={activeTab} user={user} />
      </div>
    </div>
  );
};

export default Profile;
