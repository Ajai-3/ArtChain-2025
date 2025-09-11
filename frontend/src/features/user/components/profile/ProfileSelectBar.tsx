import React from "react";
import { NavLink, useParams } from "react-router-dom";

const ProfileSelectBar: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const basePath = userId ? `/profile/${userId}` : "/profile";

  const tabs = [
    { id: "gallery", label: "Gallery" },
    { id: "favorites", label: "Favorites" },
    { id: "posts", label: "Posts" },
    { id: "shop", label: "Shop" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="border-t border-b px-4 bg-white dark:bg-secondary-color border-gray-200 dark:border-gray-800 flex justify-start gap-4 items-center overflow-x-auto sticky top-0 z-10 no-scrollbar flex-shrink-0">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={`${basePath}/${tab.id}`}
          className={({ isActive }) =>
            `flex-shrink-0 px-4 py-3 font-medium text-sm ${
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