export type ConversationType = "PRIVATE" | "GROUP";

export class Conversation {
  constructor(
    public id: string,
    public type: ConversationType = "PRIVATE",
    public memberIds: string[],
    public name?: string,
    public locked: boolean = false,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
