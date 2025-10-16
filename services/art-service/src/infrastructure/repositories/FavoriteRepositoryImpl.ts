import { injectable } from "inversify";
import { FavoriteModel } from "../models/FavoriteModel";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { Favorite } from "../../domain/entities/Favorite";
import { IFavoriteRepository } from "../../domain/repositories/IFavoriteRepository";

@injectable()
export class FavoriteRepositoryImpl
  extends BaseRepositoryImpl<Favorite>
  implements IFavoriteRepository
{
  constructor() {
    super(FavoriteModel);
  }

  async findFavorite(postId: string, userId: string): Promise<Favorite | null> {
    return await FavoriteModel.findOne({ postId, userId });
  }

  async favoriteCountByPostId(postId: string): Promise<number> {
    return await FavoriteModel.countDocuments({ postId });
  }

  async deleteFavorite(postId: string, userId: string): Promise<void> {
    await FavoriteModel.deleteOne({ postId, userId });
  }

  async getAllFavoritesByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<Favorite[]> {
    return await FavoriteModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getAllFavoritesByPost(
    postId: string,
    page: number,
    limit: number
  ): Promise<Favorite[]> {
    return await FavoriteModel.find({ postId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }
}
