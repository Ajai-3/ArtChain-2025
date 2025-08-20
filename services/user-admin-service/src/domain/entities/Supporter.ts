export class Supporter {
  constructor(
    public readonly id: string,
    public readonly supporterId: string,
    public readonly targetUserId: string,
    public readonly createdAt: Date = new Date()
  ) {}
}  