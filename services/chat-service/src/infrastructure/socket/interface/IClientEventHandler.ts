import { Socket } from "socket.io";

export interface IClientEventHandler {
  typing(socket: Socket, data: { conversationId: string }): void;

  sendMessage(
    socket: Socket,
    payload: { conversationId: string; content: string; receiverId?: string },
    callback?: (ack: boolean) => void
  ): Promise<void>;

  deleteMessage(
    socket: Socket,
    payload: {
      conversationId: string;
      messageId: string;
      mode: "ME" | "EVERYONE";
    },
    callback?: (ack: boolean) => void
  ): Promise<void>;

  convoOpened(
    socket: Socket,
    payload: { conversationId: string; time: Date }
  ): void;

  markMessagesRead(
    socket: Socket,
    payload: { conversationId: string; messageIds: string[] }
  ): Promise<void>;
}
