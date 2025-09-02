// components/NotificationUserProfile.tsx
import React from "react";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "../../../../types/notification";
import { User } from "lucide-react";

interface NotificationUserProfileProps {
  n: Notification;
  isLast?: boolean;
  lastNotificationRef?: (node: HTMLDivElement | null) => void;
  onSelectUser?: (userId: string) => void;
}

const NotificationUserProfile: React.FC<NotificationUserProfileProps> = ({
  n,
  isLast,
  lastNotificationRef,
  onSelectUser,
}) => {
  const handleClick = () => {
    if (onSelectUser && n.data?.supporterId) {
      onSelectUser(n.data.supporterId);
    }
  };

  return (
    <div
      key={n.id}
      ref={isLast ? lastNotificationRef : null}
      onClick={handleClick}
      className="flex items-center p-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900 transition"
    >
      <div className="pr-2">
        {n.data.profileimge ? (
          <img
            src={n.data?.supporterProfile || "/avatar-icon.png"}
            alt={n.data?.supporterName || "avatar"}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br bg-zinc-600 dark:bg-zinc-800 flex items-center justify-center text-white">
            {n.data.supporterName?.charAt(0).toUpperCase() || (
              <User className="w-6 h-6" />
            )}
          </div>
        )}
      </div>

      {/* Notification text */}
      <div className="flex-1">
        {n.type === "support" ? (
          <p className="dark:text-white text-black">
            <strong>{n.data.supporterName}</strong> started supporting you.
          </p>
        ) : (
          <p className="text-white">You have a new notification.</p>
        )}
        <span className="text-gray-800 dark:text-gray-400 text-sm">
          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* Unread dot */}
      {/* {!n.read && <span className="text-red-500 ml-2">●</span>} */}
    </div>
  );
};

export default NotificationUserProfile;
