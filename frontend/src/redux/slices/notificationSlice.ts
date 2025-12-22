import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "../../types/notification/notification";
import { logout } from "./userSlice";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      const existingNotification = state.notifications.find(
        (n) => n.id === action.payload.id
      );
      if (!existingNotification) {
        state.notifications.unshift(action.payload);
      }
      state.unreadCount = +1
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  addNotification,
  setNotifications,
  clearNotifications,
  setUnreadCount,
  markAsRead,
  markAllAsRead,
} = notificationSlice.actions;

export const selectNotifications = (state: {
  notifications: NotificationState;
}) => state.notifications.notifications;

export default notificationSlice.reducer;
