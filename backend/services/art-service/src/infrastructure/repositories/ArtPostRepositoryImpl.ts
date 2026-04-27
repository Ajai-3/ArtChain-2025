import { injectable } from 'inversify';
import mongoose, { Model, Document } from 'mongoose';
import { ArtPostModel } from '../models/ArtPostModel';
import { ArtPost, PostStatus } from '../../domain/entities/ArtPost';
import { BaseRepositoryImpl } from '../repositories/BaseRepositoryImpl';
import { AdminArtFilters, IArtPostRepository } from '../../domain/repositories/IArtPostRepository';
import type { MongoQuery, MongoSort } from '../../types/mongo';
import type { ArtPostLean } from '../../types/art';

@injectable()
export class ArtPostRepositoryImpl
  extends BaseRepositoryImpl<ArtPost>
  implements IArtPostRepository
{
  constructor() {
    super(ArtPostModel);
  }

  async findById(postId: string): Promise<ArtPostLean | null> {
    const art = await ArtPostModel.findOne({
      _id: postId,
      status: 'active',
    }).lean<ArtPostLean | null>();
    return art;
  }

  async findByArtName(artName: string): Promise<ArtPostLean> {
    const art = await ArtPostModel.findOne({ artName, status: 'active' }).lean<ArtPostLean | null>();
    if (!art) throw new Error(`Art with name ${artName} not found`);
    return art;
  }

  async findByIds(artIds: string[]): Promise<ArtPostLean[]> {
    const arts = await ArtPostModel.find({
      _id: { $in: artIds },
      status: 'active',
    }).lean<ArtPostLean[]>();
    return arts;
  }

  async countByUser(userId: string): Promise<number> {
    return ArtPostModel.countDocuments({ userId, status: 'active' });
  }

  async getAllArt(page = 1, limit = 10): Promise<ArtPostLean[]> {
    const arts = await ArtPostModel.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ArtPostLean[]>();
    return arts;
  }

  async getAllByUser(userId: string, page = 1, limit = 10): Promise<ArtPost[]> {
    const arts = await ArtPostModel.find({ userId, status: 'active' })
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
  ): Promise<ArtPostLean[]> {
    return await ArtPostModel.find({ artType: categoryId, status: 'active' })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<ArtPostLean[]>();
  }

  async findAllWithFilters(
    query: MongoQuery,
    page = 1,
    limit = 10,
    sort: MongoSort = { createdAt: -1 }
  ): Promise<ArtPost[]> {
    const skip = (page - 1) * limit;
    const arts = await ArtPostModel.find({ ...query, status: 'active' })
      .sort(sort as Record<string, 1 | -1>)
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
      status: 'active',
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return arts;
  }

  async update(id: string, post: Partial<ArtPost>): Promise<ArtPost> {
    const updated = await ArtPostModel.findOneAndUpdate({ _id: id }, post, {
      new: true,
    }).lean();
    if (!updated) throw new Error('Art not found');
    return updated as ArtPost;
  }

  async delete(id: string): Promise<void> {
    await ArtPostModel.findByIdAndUpdate(id, { status: 'deleted' });
  }

  // ==================================================================================
  // ADMIN ART MANAGEMENT METHODS 
  // ==================================================================================

  async findAll(
    page: number,
    limit: number,
    filters?: AdminArtFilters
  ): Promise<{ arts: Array<ArtPostLean & { id: string }>; total: number}> {
    const query: MongoQuery = {};

    if (filters?.status) query.status = filters.status;
    if (filters?.postType) query.postType = filters.postType;
    if (filters?.priceType) query.priceType = filters.priceType;
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
        .lean<ArtPostLean[]>(),
      ArtPostModel.countDocuments(query),
    ]);


    const mappedArts = arts.map((art) => ({
      ...art,
      id: (typeof art._id === 'string' ? art._id : art._id?.toString()) ?? '',
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
    ).lean<ArtPostLean | null>();
    
    if (!updated) return null;
    
    return {
      ...updated,
      id: (typeof updated._id === 'string'
        ? updated._id
        : updated._id?.toString()) ?? '',
    } as unknown as ArtPost;
  }

  async getTopArts(limit: number, type: 'likes' | 'price'): Promise<ArtPost[]> {
    if (type === 'price') {
        const arts = await ArtPostModel.find({ status: 'active', isSold: false })
          .sort({ artcoins: -1 })
          .limit(limit)
          .lean<ArtPostLean[]>();
        return arts.map((art) => ({
          ...art,
          id: (typeof art._id === 'string' ? art._id : art._id?.toString()) ?? '',
          likes: 0
        })) as unknown as ArtPost[];
    }

    // Aggregation for likes
    const arts = await ArtPostModel.aggregate([
      { $match: { status: 'active', isSold: false } },
      { 
          $addFields: { 
              strId: { $toString: '$_id' } 
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
      { $addFields: { likes: { $size: '$likesData' } } },
      { $sort: { likes: -1 } },
      { $limit: limit },
      { $project: { likesData: 0, strId: 0 } }
    ]);

    return (arts as ArtPostLean[]).map((art) => ({
      ...art,
      id: (typeof art._id === 'string' ? art._id : art._id?.toString()) ?? '',
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
                     if: { $regexMatch: { input: '$_id', regex: /^[0-9a-fA-F]{24}$/ } },
                     then: { $toObjectId: '$_id' },
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
                      if: { $gt: [{ $size: '$catDocs' }, 0] },
                      then: { $arrayElemAt: ['$catDocs.name', 0] },
                      else: '$_id'
                  }
              },
              count: 1
          }
      }
    ]);

    return (stats as Array<{ category?: string; count: number }>).map((stat) => ({
      category: stat.category || 'Uncategorized',
      count: stat.count
    }));
  }
}
