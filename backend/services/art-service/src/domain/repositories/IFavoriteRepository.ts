import { Favorite } from '../entities/Favorite';

export interface IFavoriteRepository {
  create(entity: unknown): Promise<Favorite>;
  getById(id: string): Promise<Favorite | null>;
  getAll(page?: number, limit?: number): Promise<Favorite[]>;
  update(id: string, entity: Record<string, unknown>): Promise<Favorite>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  findFavorite(postId: string, userId: string): Promise<Favorite | null>;
  favoriteCountByPostId(postId: string): Promise<number>;
  deleteFavorite(postId: string, userId: string): Promise<void>;
  getAllFavoritesByUser(userId: string, page: number, limit: number): Promise<Favorite[]>;
  getAllFavoritesByPost(postId: string, page: number, limit: number): Promise<Favorite[]>;
}
