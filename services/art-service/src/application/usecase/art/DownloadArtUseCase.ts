import { inject, injectable } from 'inversify';
import { IDownloadArtUseCase } from '../../interface/usecase/art/IDownloadArtUseCase';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IS3Service } from '../../../domain/interfaces/IS3Service';
import { IPurchaseRepository } from '../../../domain/repositories/IPurchaseRepository';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { ART_MESSAGES } from '../../../constants/ArtMessages';

@injectable()
export class DownloadArtUseCase implements IDownloadArtUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepository: IArtPostRepository,
    @inject(TYPES.IS3Service)
    private readonly _s3Service: IS3Service,
    @inject(TYPES.IPurchaseRepository)
    private readonly _purchaseRepo: IPurchaseRepository,
  ) {}

  async execute(id: string, userId: string, category: string): Promise<string> {
    if (!id || !userId || !category) {
      throw new BadRequestError(ART_MESSAGES.INVALID_REQUEST_PARAMETERS);
    }

    const art = await this._artRepository.findById(id);

    if (!art) {
      throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);
    }

    const fileName = `${art.artName}.jpg`;

    let allowed = false;

    if (art.userId === userId) {
      allowed = true;
    }

    if (
      !allowed &&
      !art.isForSale &&
      (art.artcoins === 0 || art.fiatPrice === 0)
    ) {
      allowed = true;
    }

    if (!allowed && !art.isForSale) {
      const purchase = await this._purchaseRepo.findByUserAndArt(userId, id);

      if (!purchase) {
        throw new BadRequestError(ART_MESSAGES.YOU_ARE_NOT_PURCHASER);
      }
      allowed = true;
    }

    if (!allowed) {
      throw new BadRequestError(ART_MESSAGES.ART_NOT_AVAILABLE_FOR_DOWNLOAD);
    }

    if (!art.previewUrl) {
      throw new BadRequestError(ART_MESSAGES.ART_NOT_AVAILABLE_FOR_DOWNLOAD);
    }

    const urlParts = art.previewUrl.split('/');

    const userIdFromUrl = urlParts[2];
    const filename = urlParts[urlParts.length - 1];

    const originalKey = `${userIdFromUrl}/original_art/${filename}`;

    console.log('✅ Key being sent to S3 Service:', originalKey);

    const url = this._s3Service.getSignedUrl(
      originalKey,
      'art' as any,
      fileName,
    );

    return url;
  }
}
