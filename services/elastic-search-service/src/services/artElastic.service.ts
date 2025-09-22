import { IndexedArt } from "../interface/indexArt";
import { ArtElasticRepository } from "../repositories/artElastic.repository";

const repo = new ArtElasticRepository();

export class ArtElasticService {
  async addArt(art: IndexedArt) {
    await repo.indexArt(art);
  }

  async updateArt(art: IndexedArt) {
    await repo.updateArt(art);
  }

  async searchForArt(query: string): Promise<IndexedArt[]> {
    return await repo.searchArt(query);
  }

  async adminSearch(query: string): Promise<string[]> {
    const results = await repo.searchArt(query);
    // admin needs fresh data, so only return IDs
    return results.map((art) => art.id);
  }
}
