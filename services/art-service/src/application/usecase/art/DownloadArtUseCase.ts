import { inject, injectable } from 'inversify';
import { IDownloadArtUseCase } from '../../interface/usecase/art/IDownloadArtUseCase';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IS3Service } from '../../../domain/interfaces/IS3Service';
import { IPurchaseRepository } from '../../../domain/repositories/IPurchaseRepository';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { ART_MESSAGES } from '../../../constants/ArtMessages';
import { AUCTION_MESSAGES } from '../../../constants/AuctionMessages';
import { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';

@injectable()
export class DownloadArtUseCase implements IDownloadArtUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepository: IArtPostRepository,
    @inject(TYPES.IS3Service)
    private readonly _s3Service: IS3Service,
    @inject(TYPES.IAuctionRepository)
    private readonly _auctionRepo: IAuctionRepository,
    @inject(TYPES.IPurchaseRepository)
    private readonly _purchaseRepo: IPurchaseRepository,
  ) {}

  async execute(id: string, userId: string, category: string): Promise<string> {
    if (!id || !userId || !category) {
      throw new BadRequestError(ART_MESSAGES.INVALID_REQUEST_PARAMETERS);
    }

    console.log(category, id, userId);

    let originalKey: string = '';
    let fileName: string = '';

    if (category === 'art') {
      const art = await this._artRepository.findById(id);

      if (!art) {
        throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);
      }

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

      if (!allowed) {
        const purchase = await this._purchaseRepo.findByUserAndArt(userId, id);
        if (purchase) {
          allowed = true;
        }
      }

      if (!allowed) {
        throw new BadRequestError(ART_MESSAGES.YOU_ARE_NOT_PURCHASER);
      }

      if (!art.previewUrl) {
        throw new BadRequestError(ART_MESSAGES.ART_NOT_AVAILABLE_FOR_DOWNLOAD);
      }

      const urlParts = art.previewUrl.split('/');
      const s3Filename = urlParts[urlParts.length - 1];
      const s3UserId = urlParts[2];

      fileName = `${art.artName.replace(/\s+/g, '_')}.jpg`;
      originalKey = `${s3UserId}/original_art/${s3Filename}`;
    } else if (category === 'bidding') {
      const auction = await this._auctionRepo.getById(id);

      if (!auction) {
        throw new NotFoundError(AUCTION_MESSAGES.AUCTION_NOT_FOUND);
      }

      console.log(auction);

      if (auction.status !== 'ENDED') {
        throw new BadRequestError(AUCTION_MESSAGES.AUCTION_NOT_ENDED);
      }

      if (auction.winnerId !== userId) {
        throw new BadRequestError(AUCTION_MESSAGES.YOU_ARE_NOT_BIDDER);
      }

      if (!auction.imageKey) {
        throw new BadRequestError('No image associated with this auction.');
      }

      fileName = `${auction.title.replace(/\s+/g, '_')}.jpg`;
      originalKey = `${auction.imageKey}`;
    } else {
      throw new BadRequestError('Unsupported category');
    }

    console.log('✅ Generating Signed URL for Key:', originalKey);

    return this._s3Service.getSignedUrl(originalKey, category as any, fileName);
  }
}
