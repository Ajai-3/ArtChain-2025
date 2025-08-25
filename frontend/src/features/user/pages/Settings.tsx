import React, { useState } from "react";
import LikedItems from "../components/settings/LikedItems";
import SalesHistory from "../components/settings/SalesHistory";
import BlockedUsers from "../components/settings/BlockedUsers";
import HelpAndSupport from "../components/settings/HelpAndSupport";
import { useLogoutMutation } from "../hooks/auth/useLogoutMutation";
import ProfileSettings from "../components/settings/ProfileSettings";
import PrivacySettings from "../components/settings/PrivacySettings";
import PurchaseHistory from "../components/settings/PurchaseHistory";
import PasswordSettings from "../components/settings/PasswordSettings";
import UserSettingsSideBar from "../components/sidebar/UserSettingsSideBar";
import ConfirmLogoutModal from "../../../components/modals/ConfirmLogoutModal";
import NotificationSettings from "../components/settings/NotificationSettings";
import SubscriptionSettings from "../components/settings/SubscriptionSettings";
import EmailPreferencesSettings from "../components/settings/EmailPreferencesSettings";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex w-full">
      <UserSettingsSideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      <div className="p-4 w-full h-[calc(100vh-62px)] scrollbar overflow-y-auto">
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "password" && <PasswordSettings />}
        {activeTab === "privacy" && <PrivacySettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "subscriptions" && <SubscriptionSettings />}
        {activeTab === "purchases" && <PurchaseHistory />}
        {activeTab === "sales" && <SalesHistory />}
        {activeTab === "liked" && <LikedItems />}
        {activeTab === "blocked" && <BlockedUsers />}
        {activeTab === "support" && <HelpAndSupport />}
        {activeTab === "communications" && <EmailPreferencesSettings />}
      </div>

      <ConfirmLogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Settings;
