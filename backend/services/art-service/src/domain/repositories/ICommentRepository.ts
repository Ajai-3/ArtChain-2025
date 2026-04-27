import { Comment } from '../entities/Comment';

export interface ICommentRepository {
  create(entity: unknown): Promise<Comment>;
  getById(id: string): Promise<Comment | null>;
  getAll(page?: number, limit?: number): Promise<Comment[]>;
  update(id: string, entity: Record<string, unknown>): Promise<Comment>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  countByPostId(postId: string): Promise<number>;
  getByPostId(postId: string, page: number, limit: number): Promise<Comment[]>;
}
