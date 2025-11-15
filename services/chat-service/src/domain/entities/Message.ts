export const MediaType = {
  IMAGE: "IMAGE",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];

export class Message {
  constructor(
    public id: string,
    public conversationId: string,
    public senderId: string,
    public content: string,
    public mediaType?: MediaType,
    public mediaUrl?: string,
    public readBy: string[] = [],
    public isDeleted: boolean = false,
    public deletedFor: string[] = [],
    public deletedAt?: Date,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
