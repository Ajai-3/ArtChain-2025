import { injectable } from 'inversify';
import { logger } from '../../../utils/logger';
import { config } from '../../../infrastructure/config/env';
import { IArtToElasticSearchUseCase } from '../../interface/usecase/art/IArtToElasticSearchUseCase';

@injectable()
export class ArtToElasticSearchUseCase implements IArtToElasticSearchUseCase {
  async execute(art: any): Promise<any> {
    const relativeImageUrl = art.watermarkedUrl.replace(config.cdn_domain, '');

    const elasticArt = {
      id: art._id,
      artname: art.artName,
      title: art.title,
      imageUrl: relativeImageUrl,
      hashtags: art.hashtags,
      createdAt: art.createdAt,
    };

    logger.debug(elasticArt);

    return elasticArt;
  }
}
