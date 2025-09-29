import { Favorite } from "../entities/Favorite";
import { IBaseRepository } from "./IBaseRepository";

export interface IFavoriteRepository extends IBaseRepository<Favorite> {
  findFavorite(postId: string, userId: string): Promise<Favorite | null>;
  favoriteCountByPostId(postId: string): Promise<number>;
  deleteFavorite(postId: string, userId: string): Promise<void>;
  getAllFavoritesByUser(userId: string, page: number, limit: number): Promise<Favorite[]>;
  getAllFavoritesByPost(postId: string, page: number, limit: number): Promise<Favorite[]>;
}
