import React from 'react';

interface ProfileSelectBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileSelectBar: React.FC<ProfileSelectBarProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs = [
    { id: "gallery", label: "Gallery" },
    { id: "favorites", label: "Favorites" },
    { id: "posts", label: "Posts" },
    { id: "shop", label: "Shop" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="border-t border-b z-50 bg-white dark:bg-secondary-color border-gray-200 dark:border-gray-800 flex overflow-x-auto no-scrollbar flex-shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-shrink-0 px-4 py-3 font-medium text-sm ${
            activeTab === tab.id
              ? "text-main-color dark:text-main-color font-semibold border-b-4 border-main-color dark:border-main-color"
              : "text-gray-600 dark:text-gray-300"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileSelectBar;