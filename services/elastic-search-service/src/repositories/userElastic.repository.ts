import { injectable } from "inversify";
import { IndexedUser } from "../interface/indexUser";
import { elasticClient } from "../config/elasticClient";
import { IUserElasticRepository } from "../interface/IUserElasticRepository";

const INDEX_NAME = "users";

@injectable()
export class UserElasticRepository implements IUserElasticRepository {
  async indexUser(user: IndexedUser): Promise<void> {
    await elasticClient.index({
      index: INDEX_NAME,
      id: user.id,
      document: user,
    });
    await elasticClient.indices.refresh({ index: INDEX_NAME });
  }

  async updateUser(user: IndexedUser) {
    await elasticClient.update({
      index: INDEX_NAME,
      id: user.id,
      doc: user,
      doc_as_upsert: true,
    });
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
