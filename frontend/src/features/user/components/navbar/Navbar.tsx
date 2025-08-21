import React from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import { Menu } from "lucide-react";
import ArtCoin from "./ArtCoin";
import UserInfo from "./UserInfo";
import { ThemeToggle } from "../../../../components/ThemeToggle";
import { useHasSubmittedArtistRequest } from "../../../../api/user/art/queries";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

type NavbarProps = {
  onBecomeArtist: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onBecomeArtist }) => {
  const coin = 120;

  const user = useSelector((state: RootState) => state.user.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  return (
    <div className="flex items-center justify-between px-2 sm:px-4 border-b border-zinc-400 dark:border-b-zinc-800 py-2">
      <div className="flex items-center">
        <Menu className="w-6 h-6 mr-2 sm:mr-6 text-zinc-800 dark:text-gray-300" />
        <Logo />
      </div>

      {user && isAuthenticated ? <SearchBar /> : null}

      <div className="flex items-center gap-6">
        {user && isAuthenticated ? <ArtCoin coin={coin} /> : null}
        <ThemeToggle />
        <UserInfo user={user} isAuthenticated={isAuthenticated} onBecomeArtist={onBecomeArtist} />
      </div>
    </div>
  );
};

export default Navbar;