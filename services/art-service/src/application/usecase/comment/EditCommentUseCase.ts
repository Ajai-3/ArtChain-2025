import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { IEditCommentUseCase } from "../../interface/usecase/comment/IEditCommentUseCase";
import { EditCommentDTO } from "../../interface/dto/comment/EditCommentDTO";
import { Comment, CommentStatus } from "../../../domain/entities/Comment";
import { BadRequestError } from "art-chain-shared";

@injectable()
export class EditCommentUseCase implements IEditCommentUseCase {
  constructor(
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepository: ICommentRepository
  ) {}

  async execute(dto: EditCommentDTO): Promise<Comment> {
    const { id, userId, content } = dto;

    const comment = await this._commentRepository.getById(id);

    if (!comment) {
      throw new BadRequestError("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new BadRequestError("Unauthorized to edit this comment");
    }

    const updatedComment = await this._commentRepository.update(id, {
      content,
      status: "edited" as CommentStatus,
      updatedAt: new Date(),
    });

    return updatedComment;
  }
}
