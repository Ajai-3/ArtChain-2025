import React, { useState } from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { Menu, Search, X } from "lucide-react";
import ArtCoin from "./ArtCoin";
import UserInfo from "./UserInfo";
import { ThemeToggle } from "../../../../components/ThemeToggle";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

type NavbarProps = {
  onBecomeArtist: () => void;
  onShowNotifications: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onBecomeArtist, onShowNotifications }) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  return (
    <>
      <div className="relative grid grid-cols-[auto,1fr,auto] items-center px-2 sm:px-4 border-b border-zinc-400 dark:border-zinc-800 py-2">
  <div className="flex items-center">
    <Menu className="w-6 h-6 mr-2 sm:mr-6 text-zinc-800 dark:text-gray-300" />
    <Logo />
  </div>


    <div className="hidden md:flex justify-center">
    <div className="w-full max-w-3xl">
      <SearchBar />
    </div>
  </div>


  <div className="flex items-center gap-2 sm:gap-6">
    {user && isAuthenticated && (
      <button
        className="md:hidden text-zinc-800 dark:text-gray-300"
        onClick={() => setIsMobileSearchOpen(true)}
      >
        <Search className="w-5 h-5" />
      </button>
    )}

    {user && isAuthenticated ? <ArtCoin /> : null}
    <ThemeToggle />
    <UserInfo
      user={user}
      isAuthenticated={isAuthenticated}
      onBecomeArtist={onBecomeArtist}
      onShowNotifications={onShowNotifications}
    />
  </div>
</div>


      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 bg-background z-50 md:hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <div className="flex-1 mr-2">
              <SearchBar />
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;