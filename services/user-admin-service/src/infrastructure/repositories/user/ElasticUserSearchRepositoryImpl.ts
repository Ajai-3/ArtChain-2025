import axios from 'axios';
import { injectable } from 'inversify';
import { IUserSearchRepository } from '../../../domain/repositories/user/IUserSearchRepository';
import { ROUTES } from '../../../constants/routes';

@injectable()
export class ElasticUserSearchRepositoryImpl implements IUserSearchRepository {
  async searchUserIds(query: string): Promise<string[]> {
    const response = await axios.get(
      `http://elastic-search-service:4004${ROUTES.EXTERNAL.ELASTIC_SEARCH}`,
      { params: { q: query } }
    );

    return response.data.userIds || [];
  }
}
