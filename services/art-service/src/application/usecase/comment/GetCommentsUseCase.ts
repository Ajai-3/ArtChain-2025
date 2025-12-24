import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IUserService } from "../../interface/service/IUserService";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";

@injectable()
export class GetCommentsUseCase {
  constructor(
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepo: ICommentRepository,
    @inject(TYPES.IUserService)
    private readonly _userService: IUserService
  ) {}

  async execute(postId: string, page: number, limit: number) {
    const comments = await this._commentRepo.getByPostId(postId, page, limit);

    if (comments.length === 0) return [];

    const userIds = [...new Set(comments.map((c) => c.userId.toString()))];

    const users = await this._userService.getUsersByIds(userIds);

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
