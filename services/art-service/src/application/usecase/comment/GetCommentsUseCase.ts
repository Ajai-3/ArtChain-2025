import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/invectify/types";
import { UserService } from "../../../infrastructure/service/UserService";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";

@injectable()
export class GetCommentsUseCase {
  constructor(
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepo: ICommentRepository
  ) {}

  async execute(postId: string, page: number, limit: number) {
    const comments = await this._commentRepo.getByPostId(postId, page, limit);

    if (comments.length === 0) return [];

    const userIds = [...new Set(comments.map((c) => c.userId))];

    const users = await UserService.getUsersByIds(userIds);

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
