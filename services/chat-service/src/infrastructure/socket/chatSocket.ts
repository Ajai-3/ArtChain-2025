
import { Server } from "socket.io";
import { logger } from "../utils/logger";
import { redisSub } from "../config/redis";
import { registerClientEvents } from "./handlers/registerClientEvents";
import { authMiddleware } from "../../presentation/middleware/authMiddleware";
import { subscribeChatMessages } from "./redis/chatMessageSubscriber";

export const chatSocket = (io: Server) => {
  const onlineUsers = new Map<string, string>();

  io.use(authMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    logger.info(`🔌 Socket connected: ${socket.id} (user: ${userId})`);

    onlineUsers.set(userId, socket.id);
    io.emit("chatOnline", Array.from(onlineUsers.keys()));

    logger.info(`Online users ${Array.from(onlineUsers.keys())}`);
    // Register all events for this socket
    registerClientEvents(socket, onlineUsers);

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("updateOnline", Array.from(onlineUsers.keys()));
      console.log(`🔌 Socket disconnected: ${socket.id} (user: ${userId})`);
    });
  });

  subscribeChatMessages(io, onlineUsers);
};
