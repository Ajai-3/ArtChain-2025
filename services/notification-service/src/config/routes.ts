/**
 * Centralized route constants for the notification service.
 * All route paths should be imported from this file instead of using hardcoded strings.
 */
export const ROUTES = {
  // Base API route
  BASE: "/api/v1/notifications",

  // Notification endpoints
  NOTIFICATIONS: {
    // Root endpoint - get user notifications
    ROOT: "/",
    // Get unread count
    UNREAD_COUNT: "/unread-count",
    // Mark single notification as read (with :id parameter)
    MARK_AS_READ: "/:id/read",
    // Mark all notifications as read
    MARK_ALL_AS_READ: "/mark-all-read",
  },

  // Full paths for documentation/comments
  FULL: {
    GET_NOTIFICATIONS: "/api/v1/notifications",
    GET_UNREAD_COUNT: "/api/v1/notifications/unread-count",
    MARK_AS_READ: "/api/v1/notifications/:id/read",
    MARK_ALL_AS_READ: "/api/v1/notifications/mark-all-read",
  },
} as const;

