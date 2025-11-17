export interface IClientEventHandler {
  typing(data: { conversationId: string }): void;

  sendMessage(
    payload: { conversationId: string; content: string; receiverId?: string },
    callback?: (ack: boolean) => void
  ): Promise<void>;

  deleteMessage(
    payload: {
      conversationId: string;
      messageId: string;
      mode: "ME" | "EVERYONE";
    },
    callback?: (ack: boolean) => void
  ): Promise<void>;

  convoOpened(payload: { conversationId: string; time: Date }): void;
}
