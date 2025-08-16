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
  { to: "/", icon: House, label: "Home" },
  { to: "/messages", icon: MessageSquareText, label: "Messages" },
  { to: "/liora.ai", icon: FlaskConical, label: "Liora.Ai" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/create", icon: Plus, label: "Create Post" },
  { to: "/bidding", icon: Gavel, label: "Bidding" },
  { to: "/shop", icon: ShoppingBag, label: "Shop" },
  { to: "/wallet", icon: CreditCard, label: "Wallet" },
  { to: "/profile", icon: User, label: "Profile" },
];

const UserSideBar: React.FC<{ createPostClick: () => void }> = ({ createPostClick }) => {
  return (
    <div className="border-r border-zinc-400 dark:border-zinc-800 p-2 h-[calc(100vh-64px)] w-16 flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        {links.map(({ to, icon: Icon, label }) => {
          if (label === "Create Post") {
            return (
              <button
                key={to}
                onClick={createPostClick}
                className="p-3 rounded-md flex items-center justify-center transition-colors text-zinc-800 hover:text-white dark:hover:text-white dark:text-gray-500 hover:bg-zinc-700/50 dark:hover:bg-zinc-600/30"
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
                `p-3 rounded-md flex items-center justify-center transition-colors ${
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

      <div className="flex items-center justify-center gap-2">
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