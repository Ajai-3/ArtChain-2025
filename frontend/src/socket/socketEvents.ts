import { store } from "../redux/store";
import { Socket } from "socket.io-client";
import { addNotification, setUnreadCount } from "../redux/slices/notificationSlice";

export const registerSocketEvents = (socket: Socket) => {
  socket.on("connect", () => console.log("✅ Socket connected:", socket.id));

  socket.on("notification", (data) => {
    console.log("🔔 Notification received:", data);
    store.dispatch(addNotification(data));
  });

   socket.on("unreadCount", (count: number) => {
      store.dispatch(setUnreadCount(count));
    });

  socket.on("onlineUsers", (users: string[]) => {
    console.log("👥 Online users:", users);
  });

  socket.on("connect_error", (err) => console.error("❌ Socket error:", err.message));
};
