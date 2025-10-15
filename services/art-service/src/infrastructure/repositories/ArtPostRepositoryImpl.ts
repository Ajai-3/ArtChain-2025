import { injectable } from "inversify";
import { ArtPostModel } from "../models/ArtPostModel";
import { ArtPost } from "../../domain/entities/ArtPost";
import { BaseRepositoryImpl } from "../repositories/BaseRepositoryImpl";
import { IArtPostRepository } from "../../domain/repositories/IArtPostRepository";

@injectable()
export class ArtPostRepositoryImpl
  extends BaseRepositoryImpl<ArtPost>
  implements IArtPostRepository
{
  constructor() {
    super(ArtPostModel);
  }

  async findById(postId: string): Promise<any> {
    const art = await ArtPostModel.findById({ _id: postId });
    return art;
  }

  async findByArtName(artName: string): Promise<any> {
    const art = await ArtPostModel.findOne({ artName }).lean();
    if (!art) throw new Error(`Art with name ${artName} not found`);
    return art as ArtPost;
  }

  async countByUser(userId: string): Promise<number> {
    return ArtPostModel.countDocuments({ userId });
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
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return arts as ArtPost[];
  }

  async getAllByCategory(
    categoryId: string,
    page = 1,
    limit = 10
  ): Promise<any[]> {
    return await ArtPostModel.find({ artType: categoryId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async findAllWithFilters(
    query: any,
    page = 1,
    limit = 10,
    sort: any = { createdAt: -1 }
  ): Promise<ArtPost[]> {
    const skip = (page - 1) * limit;
    const arts = await ArtPostModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    return arts;
  }

  async findAllByUser(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<ArtPost[]> {
    const skip = (page - 1) * limit;
    const arts = await ArtPostModel.find({
      userId,
      isForSale: true,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return arts;
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
