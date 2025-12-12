import { Comment } from "../../../../domain/entities/Comment";

export interface IGetCommentByIdUseCase {
  execute(commentId: string): Promise<Comment | null>;
}
