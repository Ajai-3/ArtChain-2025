import { logger } from "../../../utils/logger";

export class ArtToElasticSearchUseCase {
async execute(art: any): Promise<any> {
    const elasticArt = {
      id: art._id,
      artname: art.artName,
      title: art.title,
      imageUrl: art.watermarkedUrl,
      hashtags: art.hashtags,
      createdAt: art.createdAt
    };

    logger.debug(elasticArt);

    return elasticArt;
  }
}