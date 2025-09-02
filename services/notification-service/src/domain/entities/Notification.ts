export class Notification {
  constructor(
    public userId: string,
    public type: string,
    public data: any,
    public read = false,
    public createdAt = new Date(),
    public id?: string
  ) {}

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      data: this.data,
      read: this.read,
      createdAt: this.createdAt,
    };
  }
}
