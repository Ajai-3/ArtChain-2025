import { PostStatus, PostType, PriceType } from '../../../../domain/entities/ArtPost';
import type { AdminArtsResponse } from '../../../../types/admin-art';

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
  ): Promise<AdminArtsResponse>;
}
