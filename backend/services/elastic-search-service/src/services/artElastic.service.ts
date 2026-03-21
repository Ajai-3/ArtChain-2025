import { TYPES } from '../Inversify/types';
import { inject, injectable } from 'inversify';
import { IndexedArt } from '../interface/indexArt';
import { IArtElasticService } from '../interface/IArtElasticService';
import { IArtElasticRepository } from '../interface/IArtElasticRepository';
import { mapCdnUrl } from '../utils/mapCdnUrl';

@injectable()
export class ArtElasticService implements IArtElasticService {
  constructor(
    @inject(TYPES.IArtElasticRepository)
    private readonly _repo: IArtElasticRepository
  ) {}

  async addArt(art: IndexedArt) {
    await this._repo.indexArt(art);
  }

  async updateArt(art: IndexedArt) {
    await this._repo.updateArt(art);
  }

  async searchForArt(query: string): Promise<IndexedArt[]> {
    const results = await this._repo.searchArt(query);

    return results.map((art) => ({
      ...art,
      imageUrl: mapCdnUrl(art.imageUrl) || '',
    }));
  }

  async adminSearch(query: string): Promise<string[]> {
    const results = await this._repo.searchArt(query);
    return results.map((art) => art.id);
  }
}
