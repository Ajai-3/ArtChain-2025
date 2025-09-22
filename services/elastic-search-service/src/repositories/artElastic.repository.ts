import { elasticClient } from "../config/elasticClient";
import { IndexedArt } from "../interface/indexArt";

const INDEX_NAME = "arts";

export class ArtElasticRepository {
  async indexArt(art: IndexedArt): Promise<void> {
    await elasticClient.index({
      index: INDEX_NAME,
      id: art.id,
      document: art,
    });
    await elasticClient.indices.refresh({ index: INDEX_NAME });
  }

  async updateArt(art: IndexedArt) {
    await elasticClient.update({
      index: INDEX_NAME,
      id: art.id,
      doc: art,
      doc_as_upsert: true,
    });
  }

  async searchArt(query: string): Promise<IndexedArt[]> {
    const result = await elasticClient.search({
      index: INDEX_NAME,
      size: 20,
      sort: [{ createdAt: "desc" }],
      query: {
        bool: {
          should: [
            { match_phrase_prefix: { title: query } },
            { match_phrase_prefix: { artName: query } },
            { match_phrase_prefix: { hashtags: query } },
            { fuzzy: { title: { value: query, fuzziness: "AUTO" } } },
            { fuzzy: { artName: { value: query, fuzziness: "AUTO" } } },
            { fuzzy: { hashtags: { value: query, fuzziness: "AUTO" } } },
          ],
        },
      },
    });

    return result.hits.hits.map((hit: any) => hit._source as IndexedArt);
  }
}
