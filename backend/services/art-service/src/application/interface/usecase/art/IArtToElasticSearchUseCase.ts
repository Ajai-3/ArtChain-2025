import type { ArtToElasticSearchInput, ArtToElasticSearchResponse } from '../../../../types/usecase-response';

export interface IArtToElasticSearchUseCase {
  execute(art: ArtToElasticSearchInput): Promise<ArtToElasticSearchResponse>;
}
