import { ArtPost } from "../../domain/entities/ArtPost";
import { IArtPostRepository } from "../../domain/repositories/IArtPostRepository";
import { ArtPostModel } from "../models/ArtPostModel";
import { BaseRepositoryImpl } from "../repositories/BaseRepositoryImpl";

export class ArtPostRepositoryImpl
  extends BaseRepositoryImpl<ArtPost>
  implements IArtPostRepository
{
  constructor() {
    super(ArtPostModel);
  }

  async findByArtName(artName: string): Promise<any> {
    const art = await ArtPostModel.findOne({ artName }).lean();
    if (!art) throw new Error(`Art with name ${artName} not found`);
    return art as ArtPost;
  }

  async getAllArt(page = 1, limit = 10): Promise<any[]> {
    const arts = await ArtPostModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return arts;
  }

  async getAllByUser(userId: string, page = 1, limit = 10): Promise<ArtPost[]> {
    const arts = await ArtPostModel.find({ userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return arts as ArtPost[];
  }

  async update(id: string, post: Partial<ArtPost>): Promise<ArtPost> {
    const updated = await ArtPostModel.findOneAndUpdate({ id }, post, {
      new: true,
    }).lean();
    if (!updated) throw new Error("Art not found");
    return updated as ArtPost;
  }

  async delete(id: string): Promise<void> {
    await ArtPostModel.deleteOne({ id });
  }
}
