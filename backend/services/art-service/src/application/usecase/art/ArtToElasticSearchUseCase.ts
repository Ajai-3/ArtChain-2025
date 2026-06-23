import { injectable } from 'inversify';
import { logger } from '../../../utils/logger';
import { config } from '../../../infrastructure/config/env';
import { IArtToElasticSearchUseCase } from '../../interface/usecase/art/IArtToElasticSearchUseCase';
import type { ArtToElasticSearchInput, ArtToElasticSearchResponse } from '../../../types/usecase-response';

@injectable()
export class ArtToElasticSearchUseCase implements IArtToElasticSearchUseCase {
  async execute(art: ArtToElasticSearchInput): Promise<ArtToElasticSearchResponse> {
    const relativeImageUrl = art.watermarkedUrl.replace(config.cdn_domain, '');

    const elasticArt = {
      id: art.id,
      artname: art.artName,
      title: art.title,
      imageUrl: relativeImageUrl,
      hashtags: art.hashtags,
      createdAt: art.createdAt,
    };

    logger.debug(elasticArt);

    return { success: true, art };
  }
}
