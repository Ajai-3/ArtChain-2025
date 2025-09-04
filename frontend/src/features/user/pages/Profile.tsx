import ProfileTopBar from "../components/profile/ProfileTopBar";
import { useProfileData } from "../hooks/profile/useProfileData";
import ProfileContent from "../components/profile/ProfileContent";
import ProfileSelectBar from "../components/profile/ProfileSelectBar";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";

const Profile: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    profileUser,
    isOwnProfile,
    isSupporting,
    displaySupportingCount,
    displaySupportersCount,
  } = useProfileData();

  if (isLoading) return <ProfileSkeleton />;
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
