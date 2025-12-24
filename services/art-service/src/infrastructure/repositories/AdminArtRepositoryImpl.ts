import { injectable } from "inversify";
import { ArtPostModel } from "../models/ArtPostModel";
import { ArtPost, PostStatus, PostType, PriceType } from "../../domain/entities/ArtPost";
import { IAdminArtRepository } from "../../domain/repositories/IAdminArtRepository";

@injectable()
export class AdminArtRepositoryImpl implements IAdminArtRepository {
  async findAll(
    page: number,
    limit: number,
    filters?: {
      status?: PostStatus;
      postType?: PostType;
      priceType?: PriceType;
      search?: string;
      userId?: string;
    }
  ): Promise<{ arts: any[]; total: number }> {
    const query: any = {};

    if (filters?.status && filters.status !== ('all' as any)) query.status = filters.status;
    if (filters?.postType && filters.postType !== ('all' as any)) query.postType = filters.postType;
    if (filters?.priceType && filters.priceType !== ('all' as any)) query.priceType = filters.priceType;
    if (filters?.userId) query.userId = filters.userId;
    
    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { artName: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ];
    }

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

  async updateStatus(id: string, status: PostStatus): Promise<ArtPost | null> {
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

  async findById(id: string): Promise<ArtPost | null> {
    const art = await ArtPostModel.findById(id).lean();
    
    if (!art) return null;

    return {
      ...art,
      id: (art as any)._id.toString(),
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
      { $project: { likesData: 0, strId: 0 } } // Remove internal fields
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
