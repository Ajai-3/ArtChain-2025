import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { Button } from "../../../../components/ui/button";
import { useHasSubmittedArtistRequest } from "../../../../api/user/art/queries";

type UserInfoProps = {
  onBecomeArtist: () => void;
};

const UserInfo = ({ onBecomeArtist }: UserInfoProps) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );


  return (
    <div className="flex items-center gap-3">
      {isAuthenticated && user ? (
        <>
          <button
            onClick={() => navigate("/notifications")}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Profile"
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-600"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white">
                {user.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
              </div>
            )}
          </button>

          <Button 
            variant="main" 
            className="hidden sm:flex"
            onClick={onBecomeArtist}
            
          >
            Become an Artist
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Log in
          </Button>
          <Button variant="main" onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </>
      )}
    </div>
  );
};

export default UserInfo;