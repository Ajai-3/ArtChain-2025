import {
  House,
  MessageSquareText,
  FlaskConical,
  Bell,
  Plus,
  Gavel,
  ShoppingBag,
  CreditCard,
  User,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { ROUTES } from "../../../../constants/routes";

const UserSideBar: React.FC<{ createPostClick: () => void }> = ({
  createPostClick,
}) => {
  const unreadCount = useSelector(
    (state: any) => state.notification.unreadCount
  );
  const user = useSelector((state: RootState) => state.user.user);

  const links = [
    { to: ROUTES.HOME, icon: House, label: "Home", authRequired: false, showOn: "all" },
    { to: ROUTES.CHAT, icon: MessageSquareText, label: "Chat", authRequired: true, showOn: "all" },
    { to: ROUTES.LIORA_AI, icon: FlaskConical, label: "Liora.Ai", authRequired: true, showOn: "all" },
    { to: ROUTES.NOTIFICATIONS, icon: Bell, label: "Notifications", authRequired: true, showOn: "desktop" },
    { to: ROUTES.CREATE, icon: Plus, label: "Create Post", authRequired: true, showOn: "all" },
    { to: ROUTES.BIDDING, icon: Gavel, label: "Bidding", authRequired: true, showOn: "all" },
    { to: ROUTES.SHOP, icon: ShoppingBag, label: "Shop", authRequired: true, showOn: "desktop" },
    { to: ROUTES.WALLET, icon: CreditCard, label: "Wallet", authRequired: true, showOn: "desktop" },
    { to: user ? ROUTES.PROFILE(user.username) : ROUTES.LOGIN, icon: User, label: "Profile", authRequired: true, showOn: "all" },
  ];

  return (
    <div className="border-t sm:border-r sm:border-t-0 z-50 border-zinc-400 dark:border-zinc-800 p-2 h-auto sm:h-[calc(100vh-64px)] w-full sm:w-16 flex flex-row md:flex-col justify-between dark:bg-black">

      {/* Sidebar Links */}
      <div className="flex flex-row sm:flex-col justify-between w-full sm:w-auto sm:gap-2">
        {links.map((link) => {
          const { to, icon: Icon, label, showOn, authRequired } = link;
          const responsiveClass = showOn === "desktop" ? "hidden sm:block" : "";
          const navTo = authRequired && !user ? ROUTES.LOGIN : to;

          return (
            <NavLink
              key={to}
              to={navTo}
              title={label}
              onClick={(e) => {
                if (label === "Create Post") {
                  e.preventDefault(); // prevent navigation
                  createPostClick();
                }
              }}
              className={({ isActive }) =>
                `relative p-3 rounded-md transition-colors ${
                  isActive
                    ? "bg-zinc-700/50 dark:bg-zinc-700/30 text-white"
                    : "text-zinc-800 hover:text-white dark:text-gray-500 hover:bg-zinc-700/50 dark:hover:bg-zinc-600/30"
                } ${responsiveClass}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive ? "text-white" : "text-zinc-800 dark:text-gray-500"
                    }`}
                  />
                  {label === "Notifications" && unreadCount > 0 && (
                    <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-main-color rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Settings Link */}
      {user && (
        <div className="hidden md:flex items-center justify-center gap-2">
          <NavLink
            to={ROUTES.SETTINGS}
            title="Settings"
            className={({ isActive }) =>
              `p-3 rounded-md flex items-center justify-center transition-colors ${
                isActive
                  ? "bg-zinc-700/50 dark:bg-zinc-700/30 text-white"
                  : "text-zinc-800 dark:text-gray-500 hover:bg-zinc-700/50 dark:hover:bg-zinc-600/30"
              }`
            }
          >
            {({ isActive }) => (
              <Settings
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-white" : "text-zinc-800 dark:text-gray-500"
                }`}
              />
            )}
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default UserSideBar;
