export type CommentStatus = "original" | "edited";

export class Comment {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly status: CommentStatus = "original",
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
