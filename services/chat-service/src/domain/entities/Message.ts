export type MessageType = "IMAGE" | "AUDIO" | "VIDEO";

export class Message {
  constructor(
    public id: string,
    public conversationId: string,
    public senderId: string,
    public text: string,
    public type: MessageType,
    public mediaUrl?: string,
    public readBy: string[] = [],
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
