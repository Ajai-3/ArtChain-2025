import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import type { User as safeuser } from "../../../../types/users/user/user";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { ROUTES } from "../../../../constants/routes";

type UserInfoProps = {
  onBecomeArtist: () => void;
  isAuthenticated: boolean;
  user: safeuser | null;
  onShowNotifications: () => void;
};

const UserInfo = ({ user, isAuthenticated, onBecomeArtist, onShowNotifications }: UserInfoProps) => {
  const navigate = useNavigate();
  const unreadCount = useSelector(
    (state: RootState) => state.notification.unreadCount
  );

  return (
    <>
      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <>
            <button
              onClick={onShowNotifications}
              className="relative p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-main-color rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate(user?.username ? ROUTES.PROFILE(user.username) : ROUTES.HOME)}
              className="rounded-full hidden sm:block hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Profile"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border border-zinc-300 dark:border-zinc-600"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-zinc-600 dark:bg-zinc-800 flex items-center justify-center text-white">
                  {user.name?.charAt(0).toUpperCase() || (
                    <User className="w-4 h-4" />
                  )}
                </div>
              )}
            </button>

            {user.isVerified === false && user.role === "user" ? (
              <Button
                variant="main"
                className="hidden sm:flex"
                onClick={onBecomeArtist}
              >
                Become an Artist
              </Button>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => navigate(ROUTES.LOGIN)}>
              Log in
            </Button>
            <Button variant="main" onClick={() => navigate(ROUTES.SIGNUP)}>
              Sign up
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default UserInfo;
