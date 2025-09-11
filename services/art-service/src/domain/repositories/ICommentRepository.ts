import { Comment } from "../entities/Comment";
import { IBaseRepository } from "./IBaseRepository";

export interface ICommentRepository extends IBaseRepository<Comment> {
  getByPostId(postId: string, page: number, limit: number): Promise<Comment[]>;
}
