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
    onlineUsers.set(socket.data.userId, socket.id);
    io.emit("updateOnline", Array.from(onlineUsers.keys()));

    socket.on("joinConversation", async (conversationId: string) => {
      socket.join(conversationId);
      const messages = await messageService.getHistory(conversationId, socket.data.userId);
      socket.emit("chatHistory", messages);
    });

    socket.on("sendMessage", async (data: SendMessageDto) => {
       const senderId = socket.data.userId;

      const dto: SendMessageDto = {
        content: data.content,
        senderId,
        conversationId: data.conversationId,
        receiverId: data?.receiverId,
      };

      const msg = await messageService.sendMessage(dto);
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
