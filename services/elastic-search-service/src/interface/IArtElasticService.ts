import { IndexedArt } from "../interface/indexArt";

export interface IArtElasticService {
  addArt(art: IndexedArt): Promise<void>;
  updateArt(art: IndexedArt): Promise<void>;
  searchForArt(query: string): Promise<IndexedArt[]>;
  adminSearch(query: string): Promise<string[]>;
}
