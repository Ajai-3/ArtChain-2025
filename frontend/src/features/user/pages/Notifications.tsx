// components/Notifications.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Notification } from "../../../types/notification";
import { useNotifications } from "../hooks/notifications/useNotifications";
import NotificationUserProfile from "../components/notification/NotificationUserProfile";
import { setNotifications, addNotification } from "../../../redux/slices/notificationSlice";

interface NotificationsProps {
  socket: any;
}

const Notifications = ({ socket }: NotificationsProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications: Notification[] = useSelector(
    (state: any) => state.notification.notifications
  );

  const observer = useRef<IntersectionObserver | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications();

  useEffect(() => {
    if (data?.pages.length && notifications.length === 0) {
      const allNotifications = data.pages.flatMap((page) => page);
      dispatch(setNotifications(allNotifications));
    }
  }, [data, dispatch, notifications.length]);

  useEffect(() => {
    if (!socket) return;
    const handleNewNotification = (notif: Notification) => {
      dispatch(addNotification(notif));
    };
    socket.on("notification", handleNewNotification);
    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [socket, dispatch]);

  const lastNotificationRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
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
