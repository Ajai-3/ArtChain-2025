import { Comment } from "../../../../domain/entities/Comment";
import { EditCommentDTO } from "../../dto/comment/EditCommentDTO";

export interface IEditCommentUseCase {
  execute(dto: EditCommentDTO): Promise<Comment>;
}
