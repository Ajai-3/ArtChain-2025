import { ArtPost, PostStatus, PostType, PriceType } from '../../domain/entities/ArtPost';
import type { MongoQuery, MongoSort } from '../../types/mongo';
import type { ArtPostLean } from '../../types/art';

export interface AdminArtFilters {
  status?: PostStatus;
  postType?: PostType;
  priceType?: PriceType;
  search?: string;
  userId?: string;
  artIds?: string[];
}

export interface IArtPostRepository {
  create(entity: unknown): Promise<ArtPost>;
  getById(id: string): Promise<ArtPost | null>;
  getAll(page?: number, limit?: number): Promise<ArtPost[]>;
  update(id: string, entity: Record<string, unknown>): Promise<ArtPost>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  // User-facing methods
  getAllArt(page: number, limit: number): Promise<ArtPostLean[]>;
  findById(postId: string): Promise<ArtPostLean | null>;
  findByArtName(artName: string): Promise<ArtPostLean>;
  countByUser(userId: string): Promise<number>;
  findByIds(artIds: string[]): Promise<ArtPostLean[]>;
  getAllByUser(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<ArtPost[]>;
  getAllByCategory(
    categoryId: string,
    page: number,
    limit: number
  ): Promise<ArtPostLean[]>;
  findAllWithFilters(
    query: MongoQuery,
    page: number,
    limit: number,
    sort: MongoSort
  ): Promise<ArtPost[]>;
  findAllByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<ArtPost[]>;

  // Admin methods (merged from IAdminArtRepository)
  findAll(
    page: number,
    limit: number,
    filters?: AdminArtFilters
  ): Promise<{ arts: Array<ArtPostLean & { id: string }>; total: number }>;
  
  countStats(): Promise<{
    total: number;
    free: number;
    premium: number;
    aiGenerated: number;
  }>;
  
  updateStatus(id: string, status: PostStatus): Promise<ArtPost | null>;
  getTopArts(limit: number, type: 'likes' | 'price'): Promise<ArtPost[]>;
  getCategoryStats(): Promise<{ category: string; count: number }[]>;
}
