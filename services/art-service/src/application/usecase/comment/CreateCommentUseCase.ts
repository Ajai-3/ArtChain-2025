import { inject, injectable } from "inversify";
import { BadRequestError } from "art-chain-shared";
import { Comment } from "../../../domain/entities/Comment";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ERROR_MESSAGES } from "../../../constants/ErrorMessages";
import { CreateCommentDTO } from "../../interface/dto/comment/CreateCommentDTO";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { ICreateCommentUseCase } from "../../interface/usecase/comment/ICreateCommentUseCase";

@injectable()
export class CreateCommentUseCase implements ICreateCommentUseCase {
  constructor(
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepo: ICommentRepository
  ) {}

  async execute(dto: CreateCommentDTO): Promise<Comment> {
    if (!dto.userId) {
      throw new BadRequestError(ERROR_MESSAGES.USER_ID_MISSING);
    }

    const comment = new Comment(
      dto.postId,
      dto.userId,
      dto.content,
      "original"
    );

    const created = await this._commentRepo.create(comment);
    return created;
  }
}
