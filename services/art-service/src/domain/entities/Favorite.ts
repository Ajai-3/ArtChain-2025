export class Favorite {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
