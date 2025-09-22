import { Server } from "socket.io";
import { logger } from "../utils/logger";
import { socketStore } from "./socketStore";
import { authSocket } from "../../presentation/middlewares/authSocket";
import { initSocketHandler } from "./socketHandler";
import { getUnreadCountUseCase } from "../container/notificationContainer";

export const initSockets = (io: Server) => {
  initSocketHandler(io);

  io.use(authSocket);

  io.on("connection", async (socket) => {
    const userId = (socket as any).userId;
    socketStore.add(userId, socket.id);


    try {
      const unreadCount = await getUnreadCountUseCase.execute(userId);
      io.to(socket.id).emit("unreadCount", unreadCount);
    } catch (err) {
      console.error("Failed to send unread count:", err);
    }

    io.emit("onlineUsers", socketStore.getOnlineUsers());

    socket.on("disconnect", () => {
      socketStore.remove(userId);
      io.emit("onlineUsers", socketStore.getOnlineUsers());
    });
  });
};

