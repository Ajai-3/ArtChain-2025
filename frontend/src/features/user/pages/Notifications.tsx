// components/Notifications.tsx
import { useRef, useCallback, useEffect, useState } from "react";
import { useNotifications } from "../hooks/notifications/useNotifications";
import type { Notification } from "../../../types/notification";
import { useNavigate } from "react-router-dom";
import NotificationUserProfile from "../components/notification/NotificationUserProfile";
import { useSelector } from "react-redux";

interface NotificationsProps {
  socket: any; // pass your socket instance from provider
}

const Notifications = ({ socket }: NotificationsProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotifications();

  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);

  // Local state for live notifications
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>([]);

  // Merge API + live notifications
  const apiNotifications: Notification[] =
    data?.pages.flatMap((page) => page) || [];
  const notifications: Notification[] = [...liveNotifications, ...apiNotifications];

  // Socket listener for live notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notif: Notification) => {
      setLiveNotifications((prev) => [notif, ...prev]);
    };

    socket.on("notification", handleNewNotification);

    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [socket]);

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

  const handleSelectUser = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  if (!notifications.length) return <p>No notifications</p>;

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
      <div className="flex-1"></div>
    </div>
  );
};

export default Notifications;
