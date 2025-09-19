import { logger } from "../../../utils/logger";

export class ArtToElasticSearchUseCase {
async execute(art: any): Promise<any> {
    const elasticArt = {
      id: art._id,
      artname: art.artname,
      title: art.title,
      imageUrl: art.watermarkedUrl,
      createAt: art.createdAt
    };

    logger.debug(elasticArt);

    return elasticArt;
  }
}