import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  Lock,
  Bell,
  CreditCard,
  Heart,
  Ban,
  Shield,
  ShoppingBag,
  FileText,
  Mail,
  HelpCircle,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";

const userSettingsTabs = [
  { id: "profile", path: "/settings/profile", icon: User, label: "Edit Profile" },
  { id: "password", path: "/settings/password", icon: Lock, label: "Password & Security" },
  { id: "privacy", path: "/settings/privacy", icon: Shield, label: "Privacy Settings" },
  { id: "notifications", path: "/settings/notifications", icon: Bell, label: "Notifications" },
  { id: "subscriptions", path: "/settings/subscriptions", icon: CreditCard, label: "Subscriptions" },
  { id: "purchases", path: "/settings/purchases", icon: ShoppingBag, label: "Purchase History" },
  { id: "sales", path: "/settings/sales", icon: FileText, label: "Sales History" },
  { id: "liked", path: "/settings/liked", icon: Heart, label: "Liked Items" },
  { id: "blocked", path: "/settings/blocked", icon: Ban, label: "Blocked Users" },
  { id: "support", path: "/settings/support", icon: HelpCircle, label: "Help & Support" },
];

const UserSettingsSideBar: React.FC<{
  onLogoutClick: () => void;
}> = ({ onLogoutClick }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="mb-6 pl-2">
        <h1 className="text-2xl font-semibold dark:text-white">Settings</h1>
      </div>

      <div className="flex flex-col gap-1 flex-grow overflow-y-auto scrollbar pr-1">
        {userSettingsTabs.map(({ id, path, icon: Icon, label }) => (
          <NavLink
            key={id}
            to={path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `p-3 rounded-md flex items-center gap-3 transition-colors ${
                isActive
                  ? "bg-zinc-900 dark:bg-zinc-600/30 text-white"
                  : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-900 dark:hover:bg-zinc-600/30 dark:hover:text-white hover:text-white"
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Theme Toggle and Logout Buttons */}
      <div className="mt-auto space-y-1 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => {
            toggleTheme();
            setIsMobileMenuOpen(false);
          }}
          className="w-full p-3 rounded-md flex items-center gap-3 transition-colors text-zinc-700 dark:text-zinc-400 hover:bg-zinc-900 dark:hover:bg-zinc-600/30 dark:hover:text-white hover:text-white"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 flex-shrink-0" />
          ) : (
            <Moon className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button
          onClick={() => {
            onLogoutClick();
            setIsMobileMenuOpen(false);
          }}
          className="w-full p-3 rounded-md flex items-center gap-3 transition-colors text-zinc-700 dark:text-zinc-400 hover:bg-zinc-900 dark:hover:bg-zinc-600/30 dark:hover:text-white hover:text-white"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-16 right-4 z-40 p-2 rounded-md bg-background border border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex border-r text-sm border-zinc-200 dark:border-zinc-800 p-4 h-full w-64 flex-col bg-transparent flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="md:hidden fixed inset-y-0 right-0 z-50 w-72 bg-background border-l border-zinc-200 dark:border-zinc-800 p-4 flex flex-col shadow-xl">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default UserSettingsSideBar;

