// components/Notifications.tsx
import { useRef, useCallback } from "react";
import { useNotifications } from "../hooks/notifications/useNotifications";
import type { Notification } from "../../../types/notification";
import { useNavigate } from "react-router-dom";
import NotificationUserProfile from "../components/notification/NotificationUserProfile";

const Notifications = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotifications();
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  // Flatten all pages into a single array
  const notifications: Notification[] =
    data?.pages.flatMap((page) => page) || [];

  const lastNotificationRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (!notifications.length) return <p>No notifications</p>;

  const handleSelectUser = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="flex h-full">

      <div className="w-full sm:w-3/12 dark:bg-black text-white overflow-y-auto shadow-lg p-2">
        {notifications.map((n, i) => (
          <NotificationUserProfile
            key={`${n.id}-${i}`} 
            n={n}
            isLast={i === notifications.length - 1}
            lastNotificationRef={lastNotificationRef}
            onSelectUser={handleSelectUser}
          />
        ))}
        {isFetchingNextPage && <p>Loading more...</p>}
      </div>

      {/* Main content placeholder */}
      <div className="flex-1"></div>
    </div>
  );
};

export default Notifications;
