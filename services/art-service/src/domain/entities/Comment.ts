export class Comment {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly status: "active" | "deleted" = "active",
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}