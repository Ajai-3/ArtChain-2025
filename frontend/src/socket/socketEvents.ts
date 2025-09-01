import { Socket } from "socket.io-client";

export const registerSocketEvents = (socket: Socket) => {
  socket.on("connect", () => console.log("✅ Socket connected:", socket.id));

  socket.on("notification", (data) => {
    console.log("🔔 Notification received:", data);
  });

  socket.on("onlineUsers", (users: string[]) => {
    console.log("👥 Online users:", users);
  });

  socket.on("connect_error", (err) => console.error("❌ Socket error:", err.message));
};
