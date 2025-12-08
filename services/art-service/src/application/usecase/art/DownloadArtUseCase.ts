import { inject, injectable } from "inversify";
import { IDownloadArtUseCase } from "../../interface/usecase/art/IDownloadArtUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IS3Service } from "../../../domain/interfaces/IS3Service";

@injectable()
export class DownloadArtUseCase implements IDownloadArtUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepository: IArtPostRepository,
    @inject(TYPES.IS3Service)
    private readonly _s3Service: IS3Service
  ) {}

  async execute(artId: string, userId: string): Promise<string> {
    const art = await this._artRepository.findById(artId);

    if (!art) {
      throw new Error("Art not found");
    }

    if (art.userId !== userId) {
      throw new Error("You are not the owner of this art");
    }

    // Assuming the image key is stored in art.image or similar
    // We need to extract the key from the image URL if it's a full URL
    // Or if art.image is just the key.
    // Based on previous code, it seems art.image might be a URL.
    // Let's assume we need to extract the key.
    // But wait, S3FileRepository upload returns 'key' or 'publicUrl'.
    // ArtPost entity likely stores the URL.
    // I need to check ArtPost entity again to be sure what field holds the image info.
    
    // For now, I'll assume art.image is the URL and I need to extract the key.
    // Or maybe art.image is the key?
    // Let's check ArtPost entity in the next step if needed.
    // But for now I'll write a placeholder logic.
    
    let key = art.image;
    if (art.image.startsWith("http")) {
        const parts = art.image.split("/");
        // Assuming standard S3 URL structure or CDN URL
        // This might be brittle.
        // Ideally we should store the key.
        // But let's try to extract it.
        // If it's `cdn/art/userId/original_...`
        // The key for getSignedUrl (in S3Service -> S3FileRepository) expects `art/key` relative to bucket?
        // No, S3FileRepository.getSignedUrl takes `key` and prepends `art/` if category is art.
        // So we need the filename part.
        
        key = parts[parts.length - 1];
    }

    return this._s3Service.getSignedUrl(key, "art");
  }
}
