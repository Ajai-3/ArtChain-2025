import React from "react";
import type { User } from "../../../../types/users/user/user";
import GalleryTab from "./GalleryTab";
import FavoritesTab from "./FavoritesTab";
import PostsTab from "./PostsTab";
import ShopTab from "./ShopTab";
import AboutTab from "./AboutTab";

interface ProfileContentProps {
  activeTab: string;
  user: User;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ activeTab, user }) => {
  const getActiveComponent = () => {
    switch (activeTab) {
      case "gallery":
        return <GalleryTab />;
      case "favorites":
        return <FavoritesTab />;
      case "posts":
        return <PostsTab />;
      case "shop":
        return <ShopTab />;
      case "about":
        return <AboutTab />;
      default:
        return <GalleryTab />;
    }
  };

  return (
    <div className="w-full relative">
      {user?.backgroundImage && (
        <div className="absolute w-full z-10">
          <img
            src={user.backgroundImage}
            alt="Profile Background"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/10 dark:bg-black/10"></div>
        </div>
      )}

      <div className="relative z-10 pt-4 pb-20 bg-transparent">
        {getActiveComponent()}
      </div>
    </div>
  );
};

export default ProfileContent;
