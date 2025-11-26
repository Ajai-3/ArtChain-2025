import { injectable } from "inversify";
import { ArtPostModel } from "../models/ArtPostModel";
import { ArtPost, PostStatus, PostType, PriceType } from "../../domain/entities/ArtPost";
import { IAdminArtRepository } from "../../domain/repository/IAdminArtRepository";

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
    active: number;
    archived: number;
    deleted: number;
  }> {
    const [total, active, archived, deleted] = await Promise.all([
      ArtPostModel.countDocuments(),
      ArtPostModel.countDocuments({ status: "active" }),
      ArtPostModel.countDocuments({ status: "archived" }),
      ArtPostModel.countDocuments({ status: "deleted" }),
    ]);

    return { total, active, archived, deleted };
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
}
