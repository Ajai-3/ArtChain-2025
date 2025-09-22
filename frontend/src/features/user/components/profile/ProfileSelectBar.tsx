import React from "react";
import { NavLink, useParams } from "react-router-dom";

const ProfileSelectBar: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const basePath = `/${username}`;

  const tabs = [
    { id: "gallery", label: "Gallery" },
    { id: "favorites", label: "Favorites" },
    { id: "posts", label: "Posts" },
    { id: "shop", label: "Shop" },
    { id: "about", label: "About" },
  ];

  return (
    <div
      className="border-t border-b px-2 sm:px-4 bg-white dark:bg-secondary-color 
                border-gray-200 dark:border-gray-800 flex justify-start gap-3 sm:gap-4 
                items-center overflow-x-auto sticky top-0 z-20 no-scrollbar flex-shrink-0"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={`${basePath}/${tab.id}`}
          className={({ isActive }) =>
            `flex-shrink-0 px-3 sm:px-4 py-3 font-medium text-sm ${
              isActive
                ? "text-main-color font-semibold border-b-4 border-main-color"
                : "text-gray-600 dark:text-gray-300"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};

export default ProfileSelectBar;
