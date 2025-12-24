import { ArtPost, PostStatus, PostType, PriceType } from "../../domain/entities/ArtPost";
import { IBaseRepository } from "./IBaseRepository";

export interface AdminArtFilters {
  status?: PostStatus;
  postType?: PostType;
  priceType?: PriceType;
  search?: string;
  userId?: string;
  artIds?: string[]; // For Elasticsearch integration
}

export interface IArtPostRepository extends IBaseRepository<ArtPost> {
  // User-facing methods
  getAllArt(page: number, limit: number): Promise<any>;
  findById(postId: string): Promise<any>;
  findByArtName(artName: string): Promise<any>;
  countByUser(userId: string): Promise<number>;
  getAllByUser(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<ArtPost[]>;
  getAllByCategory(
    categoryId: string,
    page: number,
    limit: number
  ): Promise<any[]>;
  findAllWithFilters(
    query: any,
    page: number,
    limit: number,
    sort: any
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
  ): Promise<{ arts: any[]; total: number }>;
  
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
