import { inject, injectable } from "inversify";
import { ArtPost } from "../../../domain/entities/ArtPost";
import { TYPES } from "../../../infrastructure/invectify/types";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { ERROR_MESSAGES } from "../../../constants/ErrorMessages";
import { CATEGORY_MESSAGES } from "../../../constants/categoryMessages";
import { CreateArtPostDTO } from "../../interface/dto/art/CreateArtPostDTO";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { ICreateArtPostUseCase } from "../../interface/usecase/art/ICreateArtPostUseCase";

@injectable()
export class CreateArtPostUseCase implements ICreateArtPostUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.ICategoryRepository)
    private readonly _categoryRepo: ICategoryRepository
  ) {}

  async execute(dto: CreateArtPostDTO): Promise<any> {
    if (!dto.userId) {
      throw new BadRequestError(ERROR_MESSAGES.USER_ID_MISSING);
    }

    const category = await this._categoryRepo.getById(dto.artType);
    if (!category) {
      throw new NotFoundError(CATEGORY_MESSAGES.NOT_FOUND);
    }
    if (category.status !== "active") {
      throw new BadRequestError(CATEGORY_MESSAGES.INVALID_CATEGORY);
    }

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
    await this._categoryRepo.update((category as any)._id, {
      count: category.count + 1,
    });
    return created;
  }
}
