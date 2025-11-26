import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { IDeleteCommentUseCase } from "../../interface/usecase/comment/IDeleteCommentUseCase";
import { BadRequestError } from "art-chain-shared";

@injectable()
export class DeleteCommentUseCase implements IDeleteCommentUseCase {
  constructor(
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepository: ICommentRepository
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const comment = await this._commentRepository.getById(id);

    if (!comment) {
      throw new BadRequestError("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new BadRequestError("Unauthorized to delete this comment");
    }

    await this._commentRepository.delete(id);
  }
}
