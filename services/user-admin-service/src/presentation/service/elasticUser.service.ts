import { elasticClient } from "../../infrastructure/config/elasticSearch";
import { IndexedUser } from "../../types/IndexedUser";

const INDEX_NAME = "users";

export const indexUser = async (user: IndexedUser) => {
  await elasticClient.index({
    index: INDEX_NAME,
    id: user.id,
    document: user,
  });

  await elasticClient.indices.refresh({ index: INDEX_NAME });
};

export const searchUsersByName = async (
  query: string
): Promise<IndexedUser[]> => {
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
};
