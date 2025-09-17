import axios from "axios";
import { IUserSearchRepository } from "../../../domain/repositories/user/IUserSearchRepository";

export class ElasticUserSearchRepositoryImpl implements IUserSearchRepository {
  async searchUserIds(query: string): Promise<string[]> {
    const response = await axios.get(
      `http://elastic-search-service:4004/api/v1/elastic-user/admin/search`,
      { params: { q: query } }
    );

    return response.data.userIds || [];
  }
}
