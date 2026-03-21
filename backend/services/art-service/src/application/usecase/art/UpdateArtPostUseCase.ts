import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { UpdateArtPostDTO } from '../../interface/dto/art/UpdateArtPostDTO';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IUpdateArtPostUseCase } from '../../interface/usecase/art/IUpdateArtPostUseCase';
import { ART_MESSAGES } from '../../../constants/ArtMessages';
import { NotFoundError } from 'art-chain-shared';

@injectable()
export class UpdateArtPostUseCase implements IUpdateArtPostUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository
  ) {}

  async execute(dto: UpdateArtPostDTO): Promise<any> {
    const art = await this._artRepo.findById(dto.id);

    if (!art) throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);

    const updatedArt = await this._artRepo.update(dto.id, dto);
    
    if (!updatedArt) throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);


    return updatedArt;
  }
}
