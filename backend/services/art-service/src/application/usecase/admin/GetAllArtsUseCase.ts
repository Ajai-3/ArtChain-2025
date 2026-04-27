import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IUserService } from '../../interface/service/IUserService';
import { toGetAllArtForAdmin } from '../../mapper/admin/ArtMappersForAdmin';
import { ILikeRepository } from '../../../domain/repositories/ILikeRepository';
import { IArtPostRepository, AdminArtFilters } from '../../../domain/repositories/IArtPostRepository';
import { ICommentRepository } from '../../../domain/repositories/ICommentRepository';
import { IGetAllArtsUseCase } from '../../interface/usecase/admin/IGetAllArtsUseCase';
import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { IElasticSearchClient } from '../../../application/interface/clients/IElasticSearchClient';
import type { AdminArtsResponse } from '../../../types/admin-art';
import type { UserPublicProfile } from '../../../types/user';

interface ArtWithId {
  id?: string;
  _id?: string;
  userId: string;
  title: string;
  artName: string;
  description: string;
  artType: string;
  hashtags: string[];
  previewUrl: string;
  watermarkedUrl: string;
  aspectRatio: string;
  commentingDisabled: boolean;
  downloadingDisabled: boolean;
  isPrivate: boolean;
  isSensitive: boolean;
  isForSale: boolean;
  isSold: boolean;
  priceType?: string;
  artcoins?: number;
  fiatPrice?: number | null;
  postType: string;
  status: string;
  category?: string;
  categoryId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  downloads?: number;
}

@injectable()
export class GetAllArtsUseCase implements IGetAllArtsUseCase {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IArtPostRepository) private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.ILikeRepository) private readonly _likeRepository: ILikeRepository,
    @inject(TYPES.ICommentRepository) private readonly _commentRepository: ICommentRepository,
    @inject(TYPES.IFavoriteRepository) private readonly _favoriteRepository: IFavoriteRepository,
    @inject(TYPES.IElasticSearchClient) private readonly _elasticsearchClient: IElasticSearchClient
  ) {}

  async execute(
    page: number,
    limit: number,
    filters?: AdminArtFilters,
    _token?: string,
  ): Promise<AdminArtsResponse> {
    let arts: ArtWithId[];
    let total: number;

    if (filters?.search && filters.search.trim() !== '') {
      const artIds = await this._elasticsearchClient.searchArts(filters.search);

      if (artIds.length === 0) {
        return {
          data: [],
          meta: { page, limit, total: 0, totalPages: 0 },
        };
      }

      const { search: _search, ...otherFilters } = filters;
      const result = await this._artRepo.findAll(page, limit, { ...otherFilters, artIds });
      arts = result.arts as ArtWithId[];
      total = result.total;
    } else {
      const result = await this._artRepo.findAll(page, limit, filters);
      arts = result.arts as ArtWithId[];
      total = result.total;
    }

    const userIds = [...new Set(arts.map((art) => art.userId).filter((id): id is string => !!id))];
    let userMap = new Map<string, UserPublicProfile>();

    if (userIds.length > 0) {
      try {
        const users = await this._userService.getUsersByIds(userIds);
        userMap = new Map(users.map((u) => [u.id || '', u]));
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    }

    const enrichedArts = await Promise.all(
      arts.map(async (art) => {
        const artId = art.id || art._id || '';
        const [likeCount, commentCount, favoriteCount] = await Promise.all([
          this._likeRepository.likeCountByPostId(artId),
          this._commentRepository.countByPostId(artId),
          this._favoriteRepository.favoriteCountByPostId(artId),
        ]);

        return toGetAllArtForAdmin(
          { ...art, id: artId, previewUrl: art.previewUrl || '', downloads: art.downloads || 0 } as never,
          userMap.get(art.userId || '') || null,
          { likes: likeCount, comments: commentCount, favorites: favoriteCount, downloads: art.downloads || 0 }
        );
      })
    );

    return {
      data: enrichedArts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
