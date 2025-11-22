export const ConversationType = {
  GROUP: "GROUP",
  PRIVATE: "PRIVATE",
  REQUEST: "REQUEST",
} as const;

export type ConversationType =
  (typeof ConversationType)[keyof typeof ConversationType];

export class Conversation {
  constructor(
    public readonly id: string,
    public readonly type: ConversationType = ConversationType.PRIVATE,
    public readonly memberIds: string[],
    public readonly ownerId?: string,
    public readonly name?: string,
    public readonly adminIds: string[] = [],
    public readonly locked: boolean = false,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
