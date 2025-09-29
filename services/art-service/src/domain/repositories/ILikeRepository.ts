import { Like } from "../entities/Like";
import { IBaseRepository } from "./IBaseRepository";

export interface ILikeRepository extends IBaseRepository<Like> {
    findLike(postId: string, userId: string): Promise<Like | null>
  likeCountByPostId(postId: string): Promise<number>;
  deleteLike(postId: string, userId: string): Promise<void>
    getAllLikesByUser(userId: string, page: number, limit: number): Promise<Like[]>;
  getAllLikesByPost(postId: string, page: number, limit: number): Promise<Like[]>;
}
