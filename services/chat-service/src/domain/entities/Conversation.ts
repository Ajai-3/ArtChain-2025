export const ConversationType = {
  PRIVATE: "PRIVATE",
  GROUP: "GROUP",
} as const;

export type ConversationType =
  (typeof ConversationType)[keyof typeof ConversationType];

export class Conversation {
  constructor(
    public id: string,
    public type: ConversationType = ConversationType.PRIVATE,
    public memberIds: string[],
    public adminIds: string[] = [],
    public name?: string,
    public locked: boolean = false,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
