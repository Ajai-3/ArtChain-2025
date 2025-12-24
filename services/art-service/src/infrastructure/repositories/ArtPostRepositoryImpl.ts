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

  // ==================================================================================
  // ADMIN ART MANAGEMENT METHODS 
  // ==================================================================================

  async findAll(
    page: number,
    limit: number,
    filters?: import("../../domain/repositories/IArtPostRepository").AdminArtFilters
  ): Promise<{ arts: any[]; total: number }> {
    const query: any = {};

    if (filters?.status && filters.status !== ('all' as any)) query.status = filters.status;
    if (filters?.postType && filters.postType !== ('all' as any)) query.postType = filters.postType;
    if (filters?.priceType && filters.priceType !== ('all' as any)) query.priceType = filters.priceType;
    if (filters?.userId) query.userId = filters.userId;
    
    // If artIds are provided (from Elasticsearch), use them
    if (filters?.artIds && filters.artIds.length > 0) {
      query._id = { $in: filters.artIds };
    }
    
    // Note: search is now handled by Elasticsearch, not here

    const skip = (page - 1) * limit;

    const [arts, total] = await Promise.all([
      ArtPostModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ArtPostModel.countDocuments(query),
    ]);

    // Map _id to id for frontend consistency
    const mappedArts = arts.map((art: any) => ({
      ...art,
      id: art._id.toString(),
    }));

    return { arts: mappedArts, total };
  }

  async countStats(): Promise<{
    total: number;
    free: number;
    premium: number;
    aiGenerated: number;
  }> {
    const [total, free, premium, aiGenerated] = await Promise.all([
      ArtPostModel.countDocuments(),
      ArtPostModel.countDocuments({ isForSale: false }),
      ArtPostModel.countDocuments({ isForSale: true }),
      ArtPostModel.countDocuments({
        $or: [
          { artType: { $regex: 'ai', $options: 'i' } },
          { category: { $regex: 'ai', $options: 'i' } }
        ]
      })
    ]);

    return { total, free, premium, aiGenerated };
  }

  async updateStatus(id: string, status: import("../../domain/entities/ArtPost").PostStatus): Promise<ArtPost | null> {
    const updated = await ArtPostModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    
    if (!updated) return null;
    
    return {
      ...updated,
      id: (updated as any)._id.toString(),
    } as unknown as ArtPost;
  }

  async getTopArts(limit: number, type: 'likes' | 'price'): Promise<ArtPost[]> {
    if (type === 'price') {
        const arts = await ArtPostModel.find({ status: 'active', isSold: false })
          .sort({ artcoins: -1 })
          .limit(limit)
          .lean();
        return arts.map((art: any) => ({
          ...art,
          id: art._id.toString(),
          likes: 0
        })) as unknown as ArtPost[];
    }

    // Aggregation for likes
    const arts = await ArtPostModel.aggregate([
      { $match: { status: 'active', isSold: false } },
      { 
          $addFields: { 
              strId: { $toString: "$_id" } 
          } 
      },
      {
        $lookup: {
          from: 'likes',
          localField: 'strId',
          foreignField: 'postId',
          as: 'likesData'
        }
      },
      { $addFields: { likes: { $size: "$likesData" } } },
      { $sort: { likes: -1 } },
      { $limit: limit },
      { $project: { likesData: 0, strId: 0 } }
    ]);

    return arts.map((art: any) => ({
      ...art,
      id: art._id.toString(),
    })) as unknown as ArtPost[];
  }

  async getCategoryStats(): Promise<{ category: string; count: number }[]> {
    const stats = await ArtPostModel.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$artType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
         $addFields: {
             catId: { 
                 $cond: {
                     if: { $regexMatch: { input: "$_id", regex: /^[0-9a-fA-F]{24}$/ } },
                     then: { $toObjectId: "$_id" },
                     else: null
                 }
             }
         }
      },
      {
          $lookup: {
              from: 'categories',
              localField: 'catId',
              foreignField: '_id',
              as: 'catDocs'
          }
      },
      {
          $project: {
              category: {
                  $cond: {
                      if: { $gt: [{ $size: "$catDocs" }, 0] },
                      then: { $arrayElemAt: ["$catDocs.name", 0] },
                      else: "$_id"
                  }
              },
              count: 1
          }
      }
    ]);

    return stats.map((stat: any) => ({
      category: stat.category || 'Uncategorized',
      count: stat.count
    }));
  }
}
