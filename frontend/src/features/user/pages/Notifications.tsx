import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Notification } from "../../../types/notification";
import { useNotifications } from "../hooks/notifications/useNotifications";
import NotificationUserProfile from "../components/notification/NotificationUserProfile";
import { markAllAsRead, setNotifications } from "../../../redux/slices/notificationSlice";
import { useMarkAllAsRead } from "../hooks/notifications/useMarkAllAsRead";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications: Notification[] = useSelector(
    (state: any) => state.notification.notifications
  );


  const observer = useRef<IntersectionObserver | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotifications();

   const markAllMutation = useMarkAllAsRead();

  useEffect(() => {
    if (!data?.pages.length) return;

    const allNotifications = data.pages.flatMap((page) => page);
    const existingIds = new Set(notifications.map((n) => n.id));
    const newNotifications = allNotifications.filter((n) => !existingIds.has(n.id));

    if (newNotifications.length > 0) {
      dispatch(setNotifications([...notifications, ...newNotifications]));
    }

    if (markAllMutation.status === "idle") {
      markAllMutation.mutate(undefined, {
        onSuccess: () => {
          dispatch(markAllAsRead());
        },
      });
    }
  }, [data, dispatch, notifications, markAllMutation]);

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

  const handleSelectUser = (username: string) => {
    navigate(`/${username}`);
  };

  if (!notifications.length) return <p>No notifications</p>;

  return (
    <div className="flex h-full">
      <div className="w-full sm:w-3/12 dark:bg-black text-white overflow-y-auto shadow-lg p-2 border-r border-zync-700">
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
