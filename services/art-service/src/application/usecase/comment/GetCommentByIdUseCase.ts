import { inject, injectable } from "inversify";
import { Comment } from "../../../domain/entities/Comment";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IGetCommentByIdUseCase } from "../../interface/usecase/comment/IGetCommentByIdUseCase";

@injectable()
export class GetCommentByIdUseCase implements IGetCommentByIdUseCase {
  constructor(
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepository: ICommentRepository
  ) {}

  async execute(commentId: string): Promise<Comment | null> {
    return await this._commentRepository.getById(commentId);
  }
}
