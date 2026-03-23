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
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import { ROUTES } from "../../../../constants/routes";
import { useBiddingAlerts } from "../../hooks/bidding/useBiddingAlerts";

const UserSideBar: React.FC<{ createPostClick: () => void; onShowNotifications: () => void }> = ({
  createPostClick,
  onShowNotifications,
}) => {
  const navigate = useNavigate();
  const unreadCount = useSelector(
    (state: RootState) => state.notification.unreadCount
  );
  const user = useSelector((state: RootState) => state.user.user);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const { data: biddingAlerts } = useBiddingAlerts();

  const links = [
    { to: ROUTES.HOME, icon: House, label: "Home", authRequired: false, showOn: "all" },
    { to: ROUTES.CHAT, icon: MessageSquareText, label: "Chat", authRequired: true, showOn: "all" },
    { to: ROUTES.LIORA_AI, icon: FlaskConical, label: "Liora.Ai", authRequired: true, showOn: "all" },
    { to: "#", icon: Bell, label: "Notifications", authRequired: true, showOn: "desktop" },
    { to: ROUTES.CREATE, icon: Plus, label: "Create Post", authRequired: true, showOn: "all" },
    { to: ROUTES.BIDDING, icon: Gavel, label: "Bidding", authRequired: true, showOn: "all" },
    { to: ROUTES.SHOP, icon: ShoppingBag, label: "Shop", authRequired: true, showOn: "desktop" },
    { to: ROUTES.WALLET, icon: CreditCard, label: "Wallet", authRequired: true, showOn: "desktop" },
    { to: user ? ROUTES.PROFILE(user.username) : "#", icon: User, label: "Profile", authRequired: true, showOn: "all" },
  ];

  return (
    <div className="border-t sm:border-r sm:border-t-0 z-50 border-zinc-400 dark:border-zinc-800 p-2 h-auto sm:h-[calc(100vh-64px)] w-full sm:w-16 flex flex-row md:flex-col justify-between dark:bg-black">

      {/* Sidebar Links */}
      <div className="flex flex-row sm:flex-col justify-between w-full sm:w-auto sm:gap-2">
        {links
          .filter(link => {
            // Hide Profile if not authenticated
            if (link.label === "Profile" && !isAuthenticated) return false;
            return true;
          })
          .map((link) => {
            const { to, icon: Icon, label, showOn } = link;
            const responsiveClass = showOn === "desktop" ? "hidden sm:block" : "";

            return (
              <NavLink
                key={label}
                to={to}
                title={label}
                onClick={(e) => {
                  if (label === "Create Post") {
                    e.preventDefault();
                    if (!isAuthenticated) {
                      navigate(ROUTES.LOGIN);
                      return;
                    }
                    createPostClick();
                  } else if (label === "Notifications") {
                    e.preventDefault();
                    if (!isAuthenticated) {
                      navigate(ROUTES.LOGIN);
                      return;
                    }
                    onShowNotifications();
                  }
                }}
                className={({ isActive }) =>
                  `relative p-3 rounded-md transition-colors ${isActive && label !== "Notifications"
                    ? "bg-zinc-700/50 dark:bg-zinc-700/30 text-white"
                    : "text-zinc-800 hover:text-white dark:text-gray-500 hover:bg-zinc-700/50 dark:hover:bg-zinc-600/30"
                  } ${responsiveClass}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-6 h-6 transition-colors ${isActive && label !== "Notifications" ? "text-white" : "text-zinc-800 dark:text-gray-500"
                        }`}
                    />
                    {label === "Notifications" && unreadCount > 0 && (
                      <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-main-color rounded-full">
                        {unreadCount}
                      </span>
                    )}
                    {label === "Bidding" && biddingAlerts && (biddingAlerts.activeCount > 0 || biddingAlerts.scheduledCount > 0) && (
                      <span
                        className={`absolute inline-flex items-center justify-center font-bold leading-none text-white rounded-full transition-all duration-300 ${biddingAlerts.activeCount > 0
                          ? "top-0 left-4 bg-red-500/70 px-1.5 h-4 min-w-[30px] text-xs"
                          : "top-1 right-1 bg-indigo-500 h-5 w-5 text-xs"
                          }`}
                      >
                        {biddingAlerts.activeCount > 0 ? "LIVE" : biddingAlerts.scheduledCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
      </div>

      {/* Settings Link */}
      {isAuthenticated && (
        <div className="hidden md:flex items-center justify-center gap-2">
          <NavLink
            to={ROUTES.SETTINGS}
            title="Settings"
            className={({ isActive }) =>
              `p-3 rounded-md flex items-center justify-center transition-colors ${isActive
                ? "bg-zinc-700/50 dark:bg-zinc-700/30 text-white"
                : "text-zinc-800 dark:text-gray-500 hover:bg-zinc-700/50 dark:hover:bg-zinc-600/30"
              }`
            }
          >
            {({ isActive }) => (
              <Settings
                className={`w-6 h-6 transition-colors ${isActive ? "text-white" : "text-zinc-800 dark:text-gray-500"
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
