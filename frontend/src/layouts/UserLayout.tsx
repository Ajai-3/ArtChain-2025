import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../features/user/components/navbar/Navbar";
import CreatePost from "../features/user/components/post/CreatePost";
import UserSideBar from "../features/user/components/sidebar/UserSideBar";
import BecomeArtistModal from "../features/user/components/auth/BecomeAnArtist";

const UserLayout: React.FC = () => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showBecomeArtistModal, setShowBecomeArtistModal] = useState(false);

  return (
    <div className="h-screen">
      <Navbar onBecomeArtist={() => setShowBecomeArtistModal(true)} />
      
      <div className="flex">
        <UserSideBar createPostClick={() => setShowCreatePostModal(true)} />
        <Outlet />
      </div>

      <CreatePost 
        isOpen={showCreatePostModal} 
        onClose={() => setShowCreatePostModal(false)}
        onConfirm={() => {
          setShowCreatePostModal(false);
        }}
      />

      <BecomeArtistModal 
        isOpen={showBecomeArtistModal}
        onClose={() => setShowBecomeArtistModal(false)}
      />
    </div>
  );
};

export default UserLayout;