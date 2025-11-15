import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { redisSub } from "../config/redis";
import { Server, Socket } from "socket.io";
import { TYPES } from "../Inversify/types";
import container from "../Inversify/Inversify.config";
import { IMessageService } from "../../services/interface/IMessageService";

const messageService = container.get<IMessageService>(TYPES.IMessageService);

export const chatSocket = (io: Server) => {
  const onlineUsers = new Map<string, string>();

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, env.jwt.accessSecret) as { id: string };
      socket.data.userId = decoded.id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    onlineUsers.set(socket.data.userId, socket.id);
    io.emit("updateOnline", Array.from(onlineUsers.keys()));

    socket.on("joinConversation", async (conversationId: string) => {
      socket.join(conversationId);
      const messages = await messageService.getHistory(conversationId, socket.data.userId);
      socket.emit("chatHistory", messages);
    });

    socket.on("sendMessage", async (message) => {
      const msg = {
        ...message,
        senderId: socket.data.userId,
        createdAt: new Date(),
      };
      await messageService.sendMessage(msg);
      io.to(msg.conversationId).emit("newMessage", msg);
    });

    socket.on("typing", (data: { conversationId: string }) => {
      socket
        .to(data.conversationId)
        .emit("userTyping", { userId: socket.data.userId });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.data.userId);
      io.emit("updateOnline", Array.from(onlineUsers.keys()));
    });
  });

  redisSub.subscribe("chat");
  redisSub.on("message", (_, message) => {
    const msg = JSON.parse(message);
    io.to(msg.conversationId).emit("newMessage", msg);
  });
};
