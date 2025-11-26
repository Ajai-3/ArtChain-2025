import { PostStatus, PostType, PriceType } from "../../../../domain/entities/ArtPost";

export interface IGetAllArtsUseCase {
  execute(
    page: number,
    limit: number,
    filters?: {
      status?: PostStatus;
      postType?: PostType;
      priceType?: PriceType;
      search?: string;
      userId?: string;
    },
    token?: string
  ): Promise<{ data: any[]; meta: any }>;
}
