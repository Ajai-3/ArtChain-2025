import { Comment } from "../entities/Comment";
import { IBaseRepository } from "./IBaseRepository";

export interface ICommentRepository extends IBaseRepository<Comment> {
  countByPostId(postId: string): Promise<number>
  getByPostId(postId: string, page: number, limit: number): Promise<Comment[]>;
}
