import { Like } from '../entities/Like';

export interface ILikeRepository {
  create(entity: unknown): Promise<Like>;
  getById(id: string): Promise<Like | null>;
  getAll(page?: number, limit?: number): Promise<Like[]>;
  update(id: string, entity: Record<string, unknown>): Promise<Like>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  findLike(postId: string, userId: string): Promise<Like | null>;
  likeCountByPostId(postId: string): Promise<number>;
  deleteLike(postId: string, userId: string): Promise<void>;
  getAllLikesByUser(userId: string, page: number, limit: number): Promise<Like[]>;
  getAllLikesByPost(postId: string, page: number, limit: number): Promise<Like[]>;
}
