import { ArtPost, PostStatus, PostType, PriceType } from "../entities/ArtPost";

export interface IAdminArtRepository {
  findAll(
    page: number,
    limit: number,
    filters?: {
      status?: PostStatus;
      postType?: PostType;
      priceType?: PriceType;
      search?: string;
      userId?: string;
    }
  ): Promise<{ arts: any[]; total: number }>;
  
  countStats(): Promise<{
    total: number;
    free: number;
    premium: number;
    aiGenerated: number;
  }>;
  
  updateStatus(id: string, status: PostStatus): Promise<ArtPost | null>;
  findById(id: string): Promise<ArtPost | null>;
  getTopArts(limit: number, type: 'likes' | 'price'): Promise<ArtPost[]>;
  getCategoryStats(): Promise<{ category: string; count: number }[]>;
}
