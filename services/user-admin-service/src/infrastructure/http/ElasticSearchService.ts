import axios from 'axios';
import { injectable } from 'inversify';
import { ROUTES } from '../../constants/routes';
import { config } from '../config/env';
import { IElasticSearchService } from '../../application/interface/http/IElasticSearchService';

@injectable()
export class ElasticSearchService implements IElasticSearchService {
  async searchUserIds(query: string): Promise<string[]> {
    try {
      const response = await axios.get(
        `${config.api_gateway_URL}${ROUTES.EXTERNAL.ELASTIC_SEARCH}`,
        { params: { q: query } }
      );

      return response.data.userIds || [];
    } catch (error) {
      console.error('ElasticSearch search failed:', error);
      return [];
    }
  }
}
