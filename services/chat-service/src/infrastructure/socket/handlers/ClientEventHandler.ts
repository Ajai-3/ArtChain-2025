import { Socket } from "socket.io";
import { TYPES } from "../../Inversify/types";
import { inject, injectable, unmanaged } from "inversify";
import { IClientEventHandler } from "../interface/IClientEventHandler";
import { SendMessageDto } from "../../../applications/interface/dto/SendMessageDto";
import { DeleteMessageDto } from "../../../applications/interface/dto/DeleteMessageDto";
import { ISendMessageUseCase } from "../../../applications/interface/usecase/ISendMessageUseCase";
import { IDeleteMessageUseCase } from "../../../applications/interface/usecase/IDeleteMessageUseCase";
import { IMarkMessagesReadUseCase } from "../../../applications/interface/usecase/IMarkMessagesReadUseCase";

@injectable()
export class ClientEventHandler implements IClientEventHandler {
  constructor(
    @unmanaged() private onlineUsers: Map<string, string>,
    @inject(TYPES.ISendMessageUseCase)
    private readonly _sendMessageUseCase: ISendMessageUseCase,
    @inject(TYPES.IDeleteMessageUseCase)
    private readonly _deleteMessageUseCase: IDeleteMessageUseCase,
    @inject(TYPES.IMarkMessagesReadUseCase)
    private readonly _markMessagesReadUseCase: IMarkMessagesReadUseCase
  ) {}

  typing = (socket: Socket, data: { conversationId: string }) => {
    const userId = socket.data.userId;
    console.log(`⌨️ User ${userId} typing in conversation ${data.conversationId}`);
    socket.to(data.conversationId).emit("userTyping", { 
      userId, 
      conversationId: data.conversationId 
    });
  };

  sendMessage = async (
    socket: Socket,
    payload: SendMessageDto,
    callback?: (ack: boolean) => void
  ) => {
    const userId = socket.data.userId;

    try {
      const dto: SendMessageDto = {
        tempId: payload.tempId,
        conversationId: payload.conversationId,
        senderId: userId,
        receiverId: payload.receiverId,
        content: payload.content,
      };

      console.log(dto)

      await this._sendMessageUseCase.execute(dto);
      if (callback) callback(true);
    } catch (err) {
      console.error("Send message error:", err);
      if (callback) callback(false);
    }
  };

  deleteMessage = async (
    socket: Socket,
    payload: {
      conversationId: string;
      messageId: string;
      mode: "ME" | "EVERYONE";
    },
    callback?: (ack: boolean) => void
  ) => {
    const userId = socket.data.userId;

    try {
      const dto: DeleteMessageDto = {
        messageId: payload.messageId,
        userId,
        mode: payload.mode,
      };

      await this._deleteMessageUseCase.execute(dto);
      if (callback) callback(true);
    } catch (err) {
      console.error("Delete message error:", err);
      if (callback) callback(false);
    }
  };

  convoOpened = async (
    socket: Socket,
    payload: { conversationId: string; time: Date }
  ) => {
    const userId = socket.data.userId;
    const conversationId = payload.conversationId;
    
    console.log(`User ${userId} opened conversation ${conversationId}`);
    socket.join(conversationId);

    try {
        // Mark all messages as read when conversation is opened
        await this._markMessagesReadUseCase.execute([], userId, conversationId);
        
        // Notify others that messages have been read (optional, handled by case or here?)
        // The use case invalidates cache. We might want to emit 'messagesRead' to sender?
        // But we don't know WHICH messages were read easily without returning them.
        // For now, just marking them read is the requirement.
    } catch (error) {
        console.error("Error marking messages read on open:", error);
    }

    socket.to(conversationId).emit("userJoined", { userId });
  };

  markMessagesRead = async (
    socket: Socket,
    payload: { conversationId: string; messageIds: string[] }
  ) => {
    const userId = socket.data.userId;
    console.log(`Received markMessagesRead event from user ${userId} for conversation ${payload.conversationId}, messages: ${payload.messageIds.length}`);
    try {
      await this._markMessagesReadUseCase.execute(
        payload.messageIds,
        userId,
        payload.conversationId
      );

      socket.to(payload.conversationId).emit("messagesRead", {
        conversationId: payload.conversationId,
        messageIds: payload.messageIds,
        readBy: userId,
      });
    } catch (err) {
      console.error("Mark messages read error:", err);
    }
  };
}
