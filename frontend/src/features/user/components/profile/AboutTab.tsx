import React from "react";
import { useOutletContext } from "react-router-dom";
import type { User } from "../../../../types/users/user/user";
import { Globe, CreditCard, Shield, Activity, CheckCircle2 } from "lucide-react";

interface AboutTabProps {
  profileUser: User;
}

const AboutTab: React.FC = () => {
  const { profileUser } = useOutletContext<AboutTabProps>();

  const details = [
    {
      label: "Country",
      value: profileUser.country || "Unknown",
      icon: <Globe className="w-5 h-5 text-blue-400" />,
    },
    {
      label: "Plan",
      value: profileUser.plan || "Free",
      icon: <CreditCard className="w-5 h-5 text-purple-400" />,
    },
    {
      label: "Role",
      value: profileUser.role || "User",
      icon: <Shield className="w-5 h-5 text-green-400" />,
    },
    {
      label: "Status",
      value: profileUser.status || "Active",
      icon: <Activity className="w-5 h-5 text-orange-400" />,
    },
    {
      label: "Verified",
      value: profileUser.isVerified ? "Verified" : "Unverified",
      icon: <CheckCircle2 className={`w-5 h-5 ${profileUser.isVerified ? "text-blue-500" : "text-gray-400"}`} />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-xl">
        {/* Bio Section */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            About <span className="text-green-500">{profileUser.name || profileUser.username}</span>
          </h3>
          <div className="bg-black/20 rounded-xl p-6 border border-white/5">
            <p className="text-gray-300 leading-relaxed text-lg">
              {profileUser.bio || "No bio available."}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <h4 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider text-sm opacity-70">
          User Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {details.map((detail, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-zinc-800/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/5">
                {detail.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  {detail.label}
                </p>
                <p className="text-white font-medium capitalize">
                  {detail.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
