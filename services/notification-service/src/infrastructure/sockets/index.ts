import { Server } from "socket.io";
import { logger } from "../utils/logger";
import { socketStore } from "./socketStore";
import { authSocket } from "../../presentation/middlewares/authSocket";
import { initSocketHandler } from "./socketHandler";

export const initSockets = (io: Server) => {
  initSocketHandler(io);

  io.use(authSocket);

  io.on("connection", (socket) => {
    const userId = (socket as any).userId;
    socketStore.add(userId, socket.id);

    io.emit("onlineUsers", socketStore.getOnlineUsers());

    socket.on("disconnect", () => {
      socketStore.remove(userId);
      io.emit("onlineUsers", socketStore.getOnlineUsers());
    });
  });
};

