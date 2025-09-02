import { Socket } from "socket.io-client";
import { addNotification } from "../redux/slices/notificationSlice";
import { store } from "../redux/store";

export const registerSocketEvents = (socket: Socket) => {
  socket.on("connect", () => console.log("✅ Socket connected:", socket.id));

  socket.on("notification", (data) => {
    console.log("🔔 Notification received:", data);
    store.dispatch(addNotification(data));
  });

  socket.on("onlineUsers", (users: string[]) => {
    console.log("👥 Online users:", users);
  });

  socket.on("connect_error", (err) => console.error("❌ Socket error:", err.message));
};
