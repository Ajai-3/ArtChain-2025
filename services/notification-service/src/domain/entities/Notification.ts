export class Notification {
  constructor(
    public userId: string,
    public senderId: string,
    public type: string,
    public read = false,
    public metadata: any = {},
    public createdAt = new Date(),
    public id?: string
  ) {}

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      senderId: this.senderId,
      read: this.read,
      metadata: this.metadata,
      createdAt: this.createdAt,
    };
  }
}
