import { inject, injectable } from "inversify";
import { IDownloadArtUseCase } from "../../interface/usecase/art/IDownloadArtUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IS3Service } from "../../../domain/interfaces/IS3Service";
import { IPurchaseRepository } from "../../../domain/repositories/IPurchaseRepository";

@injectable()
export class DownloadArtUseCase implements IDownloadArtUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepository: IArtPostRepository,
    @inject(TYPES.IS3Service)
    private readonly _s3Service: IS3Service,
    @inject(TYPES.IPurchaseRepository)
    private readonly _purchaseRepo: IPurchaseRepository
  ) {}

  async execute(artId: string, userId: string): Promise<string> {
    const art = await this._artRepository.findById(artId);

    if (!art) {
      throw new Error("Art not found");
    }

    let allowed = false;

    if (art.userId === userId) {
      allowed = true;
    }

    if (!allowed && !art.isForSale && (art.artcoins === 0 || art.fiatPrice === 0)) {
       allowed = true;
    }

    if (!allowed && !art.isForSale) {
       const purchase = await this._purchaseRepo.findByUserAndArt(userId, artId);
       if (purchase) {
         allowed = true;
       }
    }

    if (!allowed) {
      throw new Error("You are not authorized to download this art");
    }

    if (!art.previewUrl) {
        throw new Error("Art image source not found");
    }


    const urlParts = art.previewUrl.split('/');
    const artIndex = urlParts.indexOf('art');
    
    if (artIndex === -1 || artIndex + 2 >= urlParts.length) {
        throw new Error("Invalid image URL format");
    }
    
    const storedUserId = urlParts[artIndex + 1];
    const storedFilename = urlParts[artIndex + 2];
    
    const keyBase = storedFilename.replace("preview_", "");
    const originalKey = `${storedUserId}/original_${keyBase}`;

    return this._s3Service.getSignedUrl(originalKey, "art" as any);
  }
}
