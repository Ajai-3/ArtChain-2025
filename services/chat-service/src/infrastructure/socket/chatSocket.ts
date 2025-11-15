import { redisSub } from "../config/redis";
import { Server, Socket } from "socket.io";
import { TYPES } from "../Inversify/types";
import container from "../Inversify/Inversify.config";
import { IMessageService } from "../../services/interface/IMessageService";
import { authMiddleware } from "../../presentation/middleware/authMiddleware";
import { SendMessageDto } from "../../applications/interface/dto/SendMessageDto";

export const chatSocket = (io: Server) => {
  const onlineUsers = new Map<string, string>();
  const messageService = container.get<IMessageService>(TYPES.IMessageService);

  io.use(authMiddleware);

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`🔌 Socket connected: ${socket.id} (user: ${userId})`);

    onlineUsers.set(userId, socket.id);
    console.log(
      `👥 Online users after disconnect (${onlineUsers.size}):`,
      Array.from(onlineUsers.keys())
    );

    io.emit("chatOnline", Array.from(onlineUsers.keys()));

    socket.on("joinConversation", async (conversationId: string) => {
      socket.join(conversationId);
      console.log(`📥 User ${userId} joined conversation: ${conversationId}`);
      const messages = await messageService.getHistory(conversationId, userId);
      socket.emit("chatHistory", messages);
    });

    socket.on("sendMessage", async (data: SendMessageDto) => {
      const dto: SendMessageDto = {
        content: data.content,
        senderId: userId,
        conversationId: data.conversationId,
        receiverId: data?.receiverId,
      };
      const msg = await messageService.sendMessage(dto);
      console.log(
        `💬 Message from ${userId} in ${msg.conversationId}:`,
        msg.content
      );
      io.to(msg.conversationId).emit("newMessage", msg);
    });

    socket.on("typing", (data: { conversationId: string }) => {
      console.log(`✍️ User ${userId} typing in ${data.conversationId}`);
      socket.to(data.conversationId).emit("userTyping", { userId });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      console.log(`❌ Socket disconnected: ${socket.id} (user: ${userId})`);
      console.log(
        "👥 Online users after disconnect:",
        Array.from(onlineUsers.keys())
      );
      io.emit("updateOnline", Array.from(onlineUsers.keys()));
    });
  });

  redisSub.subscribe("chat");
  redisSub.on("message", (_, message) => {
    const msg = JSON.parse(message);
    console.log(
      `🔔 Redis message in conversation ${msg.conversationId}:`,
      msg.content
    );
    io.to(msg.conversationId).emit("newMessage", msg);
  });
};
