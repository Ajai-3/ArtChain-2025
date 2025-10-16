import { IndexedArt } from "../interface/indexArt";

export interface IArtElasticRepository {
  indexArt(art: IndexedArt): Promise<void>;
  updateArt(art: IndexedArt): Promise<void>;
  searchArt(query: string): Promise<IndexedArt[]>;
}
