import { CommentStatus } from './../../../domain/entities/Comment';
import { Comment } from "../../../domain/entities/Comment";
import { CreateCommentDTO } from '../../interface/dto/comment/CreateCommentDTO';
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { ICreateCommentUseCase } from '../../interface/usecase/comment/ICreateCommentUseCase';

export class CreateCommentUseCase implements ICreateCommentUseCase {
  constructor(private readonly _commentRepo: ICommentRepository) {}

  async execute(dto: CreateCommentDTO): Promise<Comment> {
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
