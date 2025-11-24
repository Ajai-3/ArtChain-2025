import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import UserSettingsSideBar from "../features/user/components/sidebar/UserSettingsSideBar";
import ConfirmModal from "../components/modals/ConfirmModal";
import { useLogoutMutation } from "../features/user/hooks/auth/useLogoutMutation";

const SettingsLayout: React.FC = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex w-full h-[calc(100vh-62px)] overflow-hidden">
      <UserSettingsSideBar onLogoutClick={() => setShowLogoutModal(true)} />

      <div className="flex-1 overflow-y-auto scrollbar p-4 md:p-6">
        <Outlet />
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        confirmVariant="destructive"
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default SettingsLayout;
