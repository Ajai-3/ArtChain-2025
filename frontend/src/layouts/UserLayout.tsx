import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../features/user/components/navbar/Navbar";
import CreatePost from "../features/user/components/post/CreatePost";
import UserSideBar from "../features/user/components/sidebar/UserSideBar";
import BecomeArtistModal from "../features/user/components/auth/BecomeAnArtist";

const UserLayout: React.FC = () => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showBecomeArtistModal, setShowBecomeArtistModal] = useState(false);

  const location = useLocation();

  // Define pages where bottom sidebar should be HIDDEN on mobile
  const hideBottomSidebarPages = ["/chat", "/notifications", "/bidding"];
  const shouldHideBottomSidebar = hideBottomSidebarPages.some((path) =>
    location.pathname.startsWith(path)
  );
  return (
    <div className="h-screen overflow-hidden">
      <Navbar onBecomeArtist={() => setShowBecomeArtistModal(true)} />

      <div className="flex flex-col sm:flex-row">
        <div className="hidden sm:block">
          <UserSideBar createPostClick={() => setShowCreatePostModal(true)} />
        </div>
        <div className="w-full flex flex-col h-[calc(100vh-62px)]">
          <div className="flex-1 overflow-y-auto scrollbar relative sm:pb-0">
            <Outlet />
            {!shouldHideBottomSidebar && (
              <div className="block sm:hidden w-full fixed bottom-0 left-0">
                <UserSideBar
                  createPostClick={() => setShowCreatePostModal(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <CreatePost
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
      />

      <BecomeArtistModal
        isOpen={showBecomeArtistModal}
        onClose={() => setShowBecomeArtistModal(false)}
      />
    </div>
  );
};

export default UserLayout;
