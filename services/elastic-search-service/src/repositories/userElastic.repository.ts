import { elasticClient } from "../config/elasticClient";
import { IndexedUser } from "../interface/indexUser";

const INDEX_NAME = "users";

export class UserElasticRepository {
  async indexUser(user: IndexedUser ): Promise<void> {
    await elasticClient.index({
      index: INDEX_NAME,
      id: user.id,
      document: user,
    });
    await elasticClient.indices.refresh({ index: INDEX_NAME });
  }

  async searchUsers(query: string): Promise<IndexedUser[]> {
    const result = await elasticClient.search({
      index: INDEX_NAME,
      size: 20,
      sort: [{ createdAt: "desc" }],
      query: {
        bool: {
          should: [
            { match_phrase_prefix: { username: query } },
            { match_phrase_prefix: { name: query } },
            { match_phrase_prefix: { email: query } },
            { fuzzy: { username: { value: query, fuzziness: "AUTO" } } },
            { fuzzy: { name: { value: query, fuzziness: "AUTO" } } },
            { fuzzy: { email: { value: query, fuzziness: "AUTO" } } },
          ],
        },
      },
    });

    return result.hits.hits.map((hit: any) => hit._source as IndexedUser);
  }
}
