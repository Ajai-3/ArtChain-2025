import { inject, injectable } from 'inversify';
import { NotFoundError } from 'art-chain-shared';
import { ArtPost } from '../../../domain/entities/ArtPost';
import { ART_MESSAGES } from '../../../constants/ArtMessages';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IUserService } from '../../interface/service/IUserService';
import { IGetArtByIdUseCase } from '../../interface/usecase/art/IGetArtByIdUseCase';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { mapCdnUrl } from '../../../utils/mapCdnUrl';
import type { UserPublicProfile } from '../../../types/user';

@injectable()
export class GetArtByIdUseCase implements IGetArtByIdUseCase {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository
  ) { }

  async execute(id: string): Promise<{ art: ArtPost | null; user: UserPublicProfile | null }> {
    const art = await this._artRepo.getById(id);

    if (!art) {
      throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);
    }

    const user = await this._userService.getUserById(art.userId);

    return {
      art: { ...art, previewUrl: mapCdnUrl(art.previewUrl) || art.previewUrl, watermarkedUrl: mapCdnUrl(art.watermarkedUrl) || art.watermarkedUrl },

      user
    };
  }
}