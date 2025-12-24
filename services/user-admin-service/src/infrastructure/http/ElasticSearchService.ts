import axios from 'axios';
import { injectable } from 'inversify';
import { ROUTES } from '../../constants/routes';
import { IElasticSearchService } from '../../application/interface/http/IElasticSearchService';

@injectable()
export class ElasticSearchService implements IElasticSearchService {
  async searchUserIds(query: string): Promise<string[]> {
    const response = await axios.get(
      `http://api-gateway:4000${ROUTES.EXTERNAL.ELASTIC_SEARCH}`,
      { params: { q: query } }
    );

    return response.data.userIds || [];
  }
}
