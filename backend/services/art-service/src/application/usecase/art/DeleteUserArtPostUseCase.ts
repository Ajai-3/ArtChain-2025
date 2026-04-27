import { inject, injectable } from 'inversify';
import { ART_MESSAGES } from '../../../constants/ArtMessages';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IDeleteUserArtPostUseCase } from '../../interface/usecase/art/IDeleteUserArtPostUseCase';

@injectable()
export class DeleteUserArtPostUseCase implements IDeleteUserArtPostUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artPostRepo: IArtPostRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const art = await this._artPostRepo.findById(id);
    if (!art) throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);

    if (art.userId !== userId) {
      throw new BadRequestError(
        ART_MESSAGES.YOU_ARE_NOT_AUTHORIZED_TO_UPDATE_THIS_ART,
      );
    }

    await this._artPostRepo.delete(id);

    return;
  }
}
