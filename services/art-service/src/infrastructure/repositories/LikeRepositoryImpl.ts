import { BaseRepositoryImpl } from "./BaseRepositoryImpl";

import { ILikeRepository } from "../../domain/repositories/ILikeRepository";
import { Like } from "../../domain/entities/Like";
import { LikeModel } from "../models/LikeModel";

export class LikeRepositoryImpl
  extends BaseRepositoryImpl<Like>
  implements ILikeRepository
{
  constructor() {
    super(LikeModel);
  }

  async findLike(postId: string, userId: string): Promise<Like | null> {
    return await LikeModel.findOne({ postId, userId });
  }

  async likeCountByPostId(postId: string): Promise<number> {
    return await LikeModel.countDocuments({ postId });
  }

  async deleteLike(postId: string, userId: string): Promise<void> {
    await LikeModel.deleteOne({ postId, userId });
  }

  async getAllLikesByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<Like[]> {
    return await LikeModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getAllLikesByPost(
    postId: string,
    page: number,
    limit: number
  ): Promise<Like[]> {
    return await LikeModel.find({ postId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }
}
