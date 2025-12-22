export class Notification {
  constructor(
    public userId: string,
    public senderId: string,
    public type: string,
    public read = false,
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
      createdAt: this.createdAt,
    };
  }
}
