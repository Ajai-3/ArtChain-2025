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

const links = [
  { to: "/", icon: House, label: "Home", showOn: "all" },
  {
    to: "/messages",
    icon: MessageSquareText,
    label: "Messages",
    showOn: "all",
  },
  { to: "/liora.ai", icon: FlaskConical, label: "Liora.Ai", showOn: "all" },
  {
    to: "/notifications",
    icon: Bell,
    label: "Notifications",
    showOn: "desktop",
  },
  { to: "/create", icon: Plus, label: "Create Post", showOn: "all" },
  { to: "/bidding", icon: Gavel, label: "Bidding", showOn: "all" },
  { to: "/shop", icon: ShoppingBag, label: "Shop", showOn: "desktop" },
  { to: "/wallet", icon: CreditCard, label: "Wallet", showOn: "desktop" },
  { to: "/profile", icon: User, label: "Profile", showOn: "all" },
];

const UserSideBar: React.FC<{ createPostClick: () => void }> = ({
  createPostClick,
}) => {
  return (
    <div className="border-t sm:border-r sm:border-t-0 border-zinc-400 dark:border-zinc-800 p-2 h-auto sm:h-[calc(100vh-64px)] w-full sm:w-16 flex flex-row md:flex-col justify-between dark:bg-black">
      <div className="flex flex-row sm:flex-col justify-between w-full sm:w-auto sm:gap-2">
        {links.map(({ to, icon: Icon, label, showOn }) => {
          const responsiveClass = showOn === "desktop" ? "hidden sm:block" : "";
          if (label === "Create Post") {
            return (
              <button
                key={to}
                onClick={createPostClick}
                className="p-3 rounded-md transition-colors text-zinc-800 hover:text-white dark:hover:text-white dark:text-gray-500 hover:bg-zinc-700/50 dark:hover:bg-zinc-600/30"
                title={label}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          }
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `p-3 rounded-md transition-colors ${responsiveClass} ${
                  isActive
                    ? "bg-zinc-700/50 dark:bg-zinc-700/30 text-white"
                    : "text-zinc-800 hover:text-white dark:hover:text-white dark:text-gray-500 hover:bg-zinc-700/50 dark:hover:bg-zinc-600/30"
                }`
              }
              title={label}
            >
              <Icon className="w-6 h-6" />
            </NavLink>
          );
        })}
      </div>

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
