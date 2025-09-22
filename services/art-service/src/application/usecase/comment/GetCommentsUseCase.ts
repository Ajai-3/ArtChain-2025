import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { UserService } from "../../../infrastructure/service/UserService";

export class GetCommentsUseCase {
  constructor(private readonly _commentRepo: ICommentRepository) {}

  async execute(postId: string, page: number, limit: number) {
    const comments = await this._commentRepo.getByPostId(postId, page, limit);

    if (comments.length === 0) return [];

    const userIds = [...new Set(comments.map((c) => c.userId))];

    const users = await UserService.getUsersByIds(userIds);

    console.log(users);

    const enrichedComments = comments.map((comment) => {
      const user = users.find(
        (u) => u?.id?.toString() === comment.userId?.toString()
      );
      console.log(user);

      return {
        ...comment,
        name: user?.name ?? "Unknown User",
        userName: user?.username ?? "unknown",
        profileImage: user?.profileImage ?? null,
      };
    });

    return enrichedComments;
  }
}
