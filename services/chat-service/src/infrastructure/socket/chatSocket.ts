import { Server } from "socket.io";
import { redisSub } from "../config/redis";
import { registerClientEvents } from "./handlers/registerClientEvents";
import { authMiddleware } from "../../presentation/middleware/authMiddleware";

export const chatSocket = (io: Server) => {
  const onlineUsers = new Map<string, string>();

  io.use(authMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    console.log(`🔌 Socket connected: ${socket.id} (user: ${userId})`);

    onlineUsers.set(userId, socket.id);
    io.emit("chatOnline", Array.from(onlineUsers.keys()));

    // Register all events for this socket
    registerClientEvents(socket, onlineUsers);

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("updateOnline", Array.from(onlineUsers.keys()));
      console.log(`🔌 Socket disconnected: ${socket.id} (user: ${userId})`);
    });
  });

  redisSub.subscribe("chat");
  redisSub.on("message", (channel, message) => {
    const msg = JSON.parse(message);
    console.log(
      `🔔 Redis message in conversation ${msg.conversationId}:`,
      msg.content
    );

    if (channel === "chat_messages") {
      const data = JSON.parse(message);

      if (data.type === "new_message") {
        io.to(data.conversationId).emit("newMessage", data.message);
      } else if (data.type === "delete_message") {
        io.to(data.conversationId).emit("messageDeleted", {
          messageId: data.messageId,
        });
      }
    }
  });
};
