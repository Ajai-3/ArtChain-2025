import { Gift } from "lucide-react";
import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import type { ProfileSelectBarProps } from "../../../../types/users/profile/ProfileSelectBarProps";
import { CommissionRequestModal } from "../commission/CommissionRequestModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { Button } from "../../../../components/ui/button";

import { GiftArtCoinModal } from "../wallet/GiftArtCoinModal";

const ProfileSelectBar: React.FC<ProfileSelectBarProps> = ({ user, isOwnProfile }) => {
  const { username } = useParams<{ username?: string }>();
  const basePath = `/${username}`;
  
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user);

  const tabs = [
    { id: "gallery", label: "Gallery" },
    { id: "favorites", label: "Favorites" },
    // { id: "posts", label: "Posts" },
    { id: "shop", label: "Shop" },
    { id: "about", label: "About" },
  ];

  return (
    <div
      className="border-t border-b px-2 sm:px-4 bg-white dark:bg-secondary-color 
                 border-gray-200 dark:border-gray-800 flex justify-between items-center 
                 overflow-x-auto sticky top-0 z-20 no-scrollbar flex-shrink-0"
    >
      {/* Left side: NavLinks */}
      <div className="flex gap-3 sm:gap-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={`${basePath}/${tab.id}`}
            className={({ isActive }) =>
              `flex-shrink-0 px-3 sm:px-4 py-3 font-medium text-sm ${
                isActive
                  ? "text-main-color font-semibold border-b-4 border-main-color"
                  : "text-gray-600 dark:text-gray-300"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Right side: Small gift box button */}
      <div className="flex-shrink-0">
        <div className="hidden sm:flex items-center gap-3">
          {/* Gift Icon Button */}
          {!isOwnProfile && currentUser.isAuthenticated && (
            <button
                className="p-2 rounded-full bg-main-color text-white shadow-md hover:bg-main-color/90 active:scale-95 transition"
                title="Send a Gift"
                onClick={() => setIsGiftModalOpen(true)}
            >
                <Gift size={20} />
            </button>
          )}

          {/* Request Commission Button */}
          {!isOwnProfile && user.role === "artist" && currentUser.isAuthenticated && (
            <Button 
                onClick={() => setIsCommissionModalOpen(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 active:scale-95 transition-transform border-none"
            >
                Request Commission
            </Button>
          )}
          
        </div>
      </div>
      
      {/* Commission Modal */}
      {user?.id && user.role === "artist" && (
          <CommissionRequestModal 
            isOpen={isCommissionModalOpen} 
            onClose={() => setIsCommissionModalOpen(false)} 
            artistId={user.id}
            artistName={user.name || user.username || "Artist"}
          />
      )}

      {/* Gift Modal */}
      {user?.id && (
        <GiftArtCoinModal
            isOpen={isGiftModalOpen}
            onClose={() => setIsGiftModalOpen(false)}
            receiverId={user.id}
            receiverName={user.name || user.username || "User"}
            receiverImage={user.profileImage}
        />
      )}
    </div>
  );
};

export default ProfileSelectBar;
