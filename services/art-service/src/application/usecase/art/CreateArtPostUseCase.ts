import { ArtPost } from "../../../domain/entities/ArtPost";
import { CreateArtPostDTO } from "../../../domain/dto/CreateArtPostDTO";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ICreateArtPostUseCase } from "../../../domain/usecase/art/ICreateArtPostUseCase";

export class CreateArtPostUseCase implements ICreateArtPostUseCase {
  constructor(private readonly _artRepo: IArtPostRepository) {}

  async execute(dto: CreateArtPostDTO): Promise<any> {
    const baseName = dto.title.replace(/\s+/g, "-");

    const artCount = await this._artRepo.count();

    const artName = `${baseName}-${artCount + 1}`;

    const art = new ArtPost(
      dto.userId,
      dto.title,
      artName,
      dto.description,
      dto.artType,
      dto.hashtags,
      dto.previewUrl,
      dto.watermarkedUrl,
      dto.aspectRatio,
      dto.commentingDisabled,
      dto.downloadingDisabled,
      dto.isPrivate,
      dto.isSensitive,
      dto.isForSale,
      dto.priceType,
      dto.artcoins,
      dto.fiatPrice,
    );

    const created = await this._artRepo.create(art);
    return created;
  }
}
