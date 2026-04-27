import { inject, injectable } from 'inversify';
import { ART_MESSAGES } from '../../../constants/ArtMessages';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { UpdateArtPostResponse } from '../../../types/usecase-response';
import { UpdateArtPostDTO } from '../../interface/dto/art/UpdateArtPostDTO';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IUpdateArtPostUseCase } from '../../interface/usecase/art/IUpdateArtPostUseCase';
import { toUpdateArtPostResponse } from '../../mapper/artWithUserMapper';

@injectable()
export class UpdateArtPostUseCase implements IUpdateArtPostUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository
  ) { }

  async execute(dto: UpdateArtPostDTO): Promise<UpdateArtPostResponse> {
    const art = await this._artRepo.findById(dto.id);

    if (!art) throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);

    if (art.userId !== dto.userId) {
      throw new BadRequestError(ART_MESSAGES.YOU_ARE_NOT_AUTHORIZED_TO_UPDATE_THIS_ART);
    }

    const updatedArt = await this._artRepo.update(dto.id, dto as unknown as Record<string, unknown>);

    if (!updatedArt) throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);

    return toUpdateArtPostResponse(updatedArt, dto.id);
  }
}
