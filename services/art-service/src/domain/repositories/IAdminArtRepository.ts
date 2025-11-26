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
    active: number;
    archived: number;
    deleted: number;
  }>;
  
  updateStatus(id: string, status: PostStatus): Promise<ArtPost | null>;
  findById(id: string): Promise<ArtPost | null>;
}
