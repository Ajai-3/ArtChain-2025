import { Comment } from "../../entities/Comment";
import { CreateCommentDTO } from "../../dto/comment/CreateCommentDTO";

export interface ICreateCommentUseCase {
  execute(dto: CreateCommentDTO): Promise<Comment>;
}