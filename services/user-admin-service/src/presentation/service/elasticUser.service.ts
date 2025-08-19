import { elasticClient } from "../../infrastructure/config/elasticSearch";
import { IndexedUser } from "../../types/IndexedUser";

const INDEX_NAME = 'users';

export const indexUser = async (user: IndexedUser) => {
  await elasticClient.index({
    index: INDEX_NAME,
    id: user.id,
    document: user,
  });

  await elasticClient.indices.refresh({ index: INDEX_NAME });
};

export const searchUsersByName = async (query: string): Promise<IndexedUser[]> => {
  const result = await elasticClient.search({
    index: INDEX_NAME,
    query: {
      multi_match: {
        query,
        fields: ['username', 'name', 'email'],
        fuzziness: 'AUTO',
      },
    },
  });

  return result.hits.hits.map((hit: any) => hit._source);
};
