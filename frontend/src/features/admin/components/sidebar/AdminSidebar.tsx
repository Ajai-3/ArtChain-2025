import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Shield,
  Flag,
  Wallet,
  FileEdit,
  Settings,
  LogOut,
  Tags,
  Sparkles,
  Gavel,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../../../../components/logo/Logo";
import { useAdminLogoutMutation } from "../../hooks/auth/useAdminLogoutMutation";
import ConfirmModal from "../../../../components/modals/ConfirmModal";
import { ThemeToggle } from "../../../../components/ThemeToggle";

const adminLinks = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/user-management", icon: Users, label: "User Management" },
  { to: "/admin/category-management", icon: Tags, label: "Category Mangement" },
  { to: "/admin/ai-settings", icon: Sparkles, label: "AI Settings" },
  { to: "/admin/content-moderation", icon: Shield, label: "Content Moderation" },
  { to: "/admin/wallet-management", icon: Wallet, label: "Wallet & Financial" },
  { to: "/admin/art-management", icon: FileEdit, label: "Art Management" },
  { to: "/admin/auction-management", icon: Gavel, label: "Auction Management" },
  { to: "/admin/settings", icon: Settings, label: "Platform Settings" },
];

const AdminSideBar: React.FC = () => {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const logoutMutation = useAdminLogoutMutation();

  const handleLogoutClick = () => setLogoutModalOpen(true);
  const handleCloseModal = () => setLogoutModalOpen(false);

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logoutMutation.mutate();
  };

  return (
    <>
      <div className="border-r text-sm border-zinc-200 dark:border-zinc-800 p-2 h-screen w-16 sm:w-64 flex flex-col bg-slate-100 dark:bg-secondary-color flex-shrink-0 transition-width duration-300">
        {/* Logo */}
        <div className="mb-4 hidden sm:flex p-2 border-b border-zinc-200 dark:border-zinc-800 justify-center sm:justify-start">
          <Logo />
        </div>

        {/* Admin Links */}
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
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>

        <ThemeToggle />
        {/* Admin Controls */}
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
          <span className="hidden sm:inline">Admin Controls</span>
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={handleLogoutClick}
          className="w-full p-3 mt-2 rounded-md flex items-center gap-3 transition-colors text-zinc-700 dark:text-zinc-400 hover:bg-zinc-900 dark:hover:bg-zinc-600/30 dark:hover:text-white hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={handleCloseModal}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        confirmVariant="destructive"
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default AdminSideBar;
