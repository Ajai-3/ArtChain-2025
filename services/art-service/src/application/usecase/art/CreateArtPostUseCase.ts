import { ArtPost } from "../../../domain/entities/ArtPost";
import { CreateArtPostDTO } from "../../../domain/dto/art/CreateArtPostDTO";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ICreateArtPostUseCase } from "../../../domain/usecase/art/ICreateArtPostUseCase";

export class CreateArtPostUseCase implements ICreateArtPostUseCase {
  constructor(private readonly _artRepo: IArtPostRepository) {}

  async execute(dto: CreateArtPostDTO): Promise<any> {
    const baseName = dto.title.replace(/\s+/g, "-");

    const count = (await this._artRepo.count()) + 1;

    const countStr = count.toString().padStart(4, "0");

    const letters = Array.from({ length: 4 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join("");

    const artName = `${baseName}-${countStr}${letters}`;

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
      dto.fiatPrice
    );

    const created = await this._artRepo.create(art);
    return created;
  }
}
