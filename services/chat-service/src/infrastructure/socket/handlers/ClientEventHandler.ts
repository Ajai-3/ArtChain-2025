import { inject, injectable } from "inversify";
import { TYPES } from "../../Inversify/types";
import { IClientEventHandler } from "../interface/IClientEventHandler";
import { SendMessageDto } from "../../../applications/interface/dto/SendMessageDto";
import { DeleteMessageDto } from "../../../applications/interface/dto/DeleteMessageDto";
import { ISendMessageUseCase } from "../../../applications/interface/usecase/ISendMessageUseCase";
import { IDeleteMessageUseCase } from "../../../applications/interface/usecase/IDeleteMessageUseCase";

@injectable()
export class ClientEventHandler implements IClientEventHandler {
  constructor(
    private socket: any,
    private onlineUsers: Map<string, string>,
    @inject(TYPES.ISendMessageUseCase)
    private readonly _sendMessageUseCase: ISendMessageUseCase,
    @inject(TYPES.IDeleteMessageUseCase)
    private readonly _deleteMessageUseCase: IDeleteMessageUseCase
  ) {}

  typing = (data: { conversationId: string }) => {
    const userId = this.socket.data.userId;
    this.socket.to(data.conversationId).emit("userTyping", { userId });
  };

  sendMessage = async (
    payload: { conversationId: string; content: string; receiverId?: string },
    callback?: (ack: boolean) => void
  ) => {
    const userId = this.socket.data.userId;

    try {
      const dto: SendMessageDto = {
        conversationId: payload.conversationId,
        senderId: userId,
        receiverId: payload.receiverId,
        content: payload.content,
      };

      await this._sendMessageUseCase.execute(dto);
      if (callback) callback(true);
    } catch (err) {
      console.error("Send message error:", err);
      if (callback) callback(false);
    }
  };

  deleteMessage = async (
    payload: {
      conversationId: string;
      messageId: string;
      mode: "ME" | "EVERYONE";
    },
    callback?: (ack: boolean) => void
  ) => {
    const userId = this.socket.data.userId;

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

  convoOpened = (payload: { conversationId: string; time: Date }) => {
    const userId = this.socket.data.userId;
    console.log(`User ${userId} opened conversation ${payload.conversationId}`);
  };
}
