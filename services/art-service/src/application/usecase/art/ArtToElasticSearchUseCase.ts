import { injectable } from "inversify";
import { logger } from "../../../utils/logger";
import { IArtToElasticSearchUseCase } from "../../interface/usecase/art/IArtToElasticSearchUseCase";

@injectable()
export class ArtToElasticSearchUseCase implements IArtToElasticSearchUseCase {
  async execute(art: any): Promise<any> {
    const elasticArt = {
      id: art._id,
      artname: art.artName,
      title: art.title,
      imageUrl: art.watermarkedUrl,
      hashtags: art.hashtags,
      createdAt: art.createdAt,
    };

    logger.debug(elasticArt);

    return elasticArt;
  }
}
