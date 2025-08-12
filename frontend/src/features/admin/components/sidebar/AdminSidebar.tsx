import {
  LayoutDashboard,
  Users,
  Shield,
  Flag,
  Wallet,
  FileEdit,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../../../../components/logo/Logo";

const adminLinks = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/user-management", icon: Users, label: "User Management" },
  { to: "/admin/content", icon: Shield, label: "Content Moderation" },
  { to: "/admin/reports", icon: Flag, label: "Report & Abuse" },
  { to: "/admin/wallet", icon: Wallet, label: "Wallet & Financial" },
  { to: "/admin/posts", icon: FileEdit, label: "Post Control" },
  { to: "/admin/settings", icon: Settings, label: "Platform Settings" },
];

const AdminSideBar: React.FC = () => {
  return (
    <div className="border-r text-sm border-zinc-200 dark:border-zinc-800 p-2 h-screen w-64 flex flex-col bg-secondary-color flex-shrink-0">
      <div className="mb-4 p-2 border-b border-zinc-200 dark:border-zinc-800">
        <Logo />
      </div>

      <div className="flex flex-col gap-1">
        {adminLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `p-3 rounded-md flex items-center gap-3 transition-colors ${
                isActive
                  ? "bg-main-color/10 text-main-color"
                  : "text-zinc-500 hover:bg-main-color/10 hover:text-main-color"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>


      <NavLink
        to="/admin/controls"
        className={({ isActive }) =>
          `mt-auto p-3 rounded-md flex items-center gap-3 transition-colors ${
            isActive
              ? "bg-main-color/10 text-main-color"
              : "text-zinc-500 hover:bg-main-color/10 hover:text-main-color"
          }`
        }
      >
        <Settings className="w-5 h-5" />
        <span>Admin Controls</span>
      </NavLink>
    </div>
  );
};

export default AdminSideBar;
