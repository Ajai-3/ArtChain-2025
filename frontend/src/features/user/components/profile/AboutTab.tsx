import React from "react";
import { useOutletContext } from "react-router-dom";
import type { User } from "../../../../types/users/user/user";

interface AboutTabProps {
  profileUser: User;
}

const AboutTab: React.FC = () => {
  const { profileUser } = useOutletContext<AboutTabProps>();
  console.log(profileUser)

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/10 dark:bg-black/20 backdrop-blur-sm my-10 rounded-xl shadow-md">
      {/* Bio */}
      {profileUser.bio ? (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            About
          </h3>
          <p className="text-gray-700 dark:text-gray-200">{profileUser.bio}</p>
        </div>
      ) : null}

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
        <div>
          <span className="font-semibold">Country:</span>{" "}
          {profileUser.country || "Unknown"}
        </div>
        <div>
          <span className="font-semibold">Plan:</span>{" "}
          {profileUser.plan || "Unknown"}
        </div>
        <div>
          <span className="font-semibold">Role:</span>{" "}
          {profileUser.role || "Unknown"}
        </div>
        <div>
          <span className="font-semibold">Status:</span>{" "}
          {profileUser.status || "Unknown"}
        </div>
        <div>
          <span className="font-semibold">Verified:</span>{" "}
          {profileUser.isVerified ? "Yes ✅" : "No ❌"}
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
