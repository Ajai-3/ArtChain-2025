import React from "react";
import type { ReactNode } from "react"
import type { User } from "../../../../types/users/user/user";

interface ProfileContentProps {
  activeTab: string;
  user: User;
  children?: ReactNode;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ user, children }) => {
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
        {children}
      </div>
    </div>
  );
};

export default ProfileContent;
