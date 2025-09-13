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

const UserSideBar: React.FC<{ createPostClick: () => void }> = ({ createPostClick }) => {
  const navigate = useNavigate();
  const unreadCount = useSelector((state: any) => state.notification.unreadCount);
  const user = useSelector((state: RootState) => state.user.user); 

  const links = [
    { to: "/", icon: House, label: "Home", authRequired: false, showOn: "all" },
    { to: "/messages", icon: MessageSquareText, label: "Messages", authRequired: true, showOn: "all" },
    { to: "/liora.ai", icon: FlaskConical, label: "Liora.Ai", authRequired: true, showOn: "all" },
    { to: "/notifications", icon: Bell, label: "Notifications", authRequired: true, showOn: "desktop" },
    { to: "/create", icon: Plus, label: "Create Post", authRequired: true, showOn: "all" },
    { to: "/bidding", icon: Gavel, label: "Bidding", authRequired: true, showOn: "all" },
    { to: "/shop", icon: ShoppingBag, label: "Shop", authRequired: true, showOn: "desktop" },
    { to: "/wallet", icon: CreditCard, label: "Wallet", authRequired: true, showOn: "desktop" },
    { to: `/${user?.username}`, icon: User, label: "Profile", authRequired: true, showOn: "all" },
  ];

  const handleClick = (link: typeof links[0]) => {
    if (link.authRequired && !user) {
      navigate("/login");
    } else if (link.label === "Create Post") {
      createPostClick();
    } else {
      navigate(link.to);
    }
  };

  return (
    <div className="border-t sm:border-r sm:border-t-0 z-50 border-zinc-400 dark:border-zinc-800 p-2 h-auto sm:h-[calc(100vh-64px)] w-full sm:w-16 flex flex-row md:flex-col justify-between dark:bg-black">
      {/* Sidebar Links */}
      <div className="flex flex-row sm:flex-col justify-between w-full sm:w-auto sm:gap-2">
        {links.map((link) => {
          const { to, icon: Icon, label, showOn } = link;
          const responsiveClass = showOn === "desktop" ? "hidden sm:block" : "";

          return (
            <button
              key={to}
              onClick={() => handleClick(link)}
              className={`relative p-3 rounded-md transition-colors ${responsiveClass} text-zinc-800 hover:text-white dark:text-gray-500 hover:bg-zinc-700/50 dark:hover:bg-zinc-600/30`}
              title={label}
            >
              <Icon className="w-6 h-6" />
              {label === "Notifications" && unreadCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-main-color rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Settings */}
      <div className="hidden md:flex items-center justify-center gap-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `p-3 rounded-md flex items-center justify-center transition-colors ${
              isActive
                ? "bg-zinc-700/50 dark:bg-zinc-700/30 text-white"
                : "text-zinc-800 dark:text-gray-500 hover:bg-zinc-700/50 dark:hover:bg-zinc-600/30"
            }`
          }
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </NavLink>
      </div>
    </div>
  );
};

export default UserSideBar;
