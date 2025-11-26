import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useNotifications } from "../../hooks/notifications/useNotifications";
import { useMarkAllAsRead } from "../../hooks/notifications/useMarkAllAsRead";
import { setNotifications, markAllAsRead } from "../../../../redux/slices/notificationSlice";
import NotificationUserProfile from "./NotificationUserProfile";
import type { Notification } from "../../../../types/notification";
import type { RootState } from "../../../../redux/store";

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications: Notification[] = useSelector(
    (state: RootState) => state.notification.notifications
  );
  
  const observer = useRef<IntersectionObserver | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications();
  const markAllMutation = useMarkAllAsRead();

  useEffect(() => {
    if (!data?.pages.length) return;

    const allNotifications = data.pages.flatMap((page) => page);
    const existingIds = new Set(notifications.map((n) => n.id));
    const newNotifications = allNotifications.filter((n) => !existingIds.has(n.id));

    if (newNotifications.length > 0) {
      dispatch(setNotifications([...notifications, ...newNotifications]));
    }

    if (isOpen && markAllMutation.status === "idle") {
      markAllMutation.mutate(undefined, {
        onSuccess: () => {
          dispatch(markAllAsRead());
        },
      });
    }
  }, [data, dispatch, notifications, markAllMutation, isOpen]);

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
    onClose();
  };

  return createPortal(
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-black border-l border-zinc-200 dark:border-zinc-800 transform transition-transform duration-300 ease-in-out z-[9999] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 dark:text-white" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)]">
          {!notifications.length ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n, i) => (
                <NotificationUserProfile
                  key={`${n.id}-${i}`}
                  n={n}
                  isLast={i === notifications.length - 1}
                  lastNotificationRef={lastNotificationRef}
                  onSelectUser={handleSelectUser}
                />
              ))}
              {isFetchingNextPage && (
                <p className="text-center p-4 text-zinc-500">Loading more...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
};

export default NotificationSidebar;
