import axios from 'axios';
import { inject, injectable } from 'inversify';
import { ROUTES } from '../../constants/routes';
import { config } from '../config/env';
import { IElasticSearchService } from '../../application/interface/http/IElasticSearchService';
import { ILogger } from '../../application/interface/ILogger';
import { TYPES } from '../inversify/types';

@injectable()
export class ElasticSearchService implements IElasticSearchService {
  constructor(@inject(TYPES.ILogger) private readonly _logger: ILogger) {}

  async searchUserIds(query: string): Promise<string[]> {
    try {
      const response = await axios.get(
        `${config.api_gateway_URL}${ROUTES.EXTERNAL.ELASTIC_SEARCH}`,
        { params: { q: query } },
      );

      return response.data.userIds || [];
    } catch (error) {
      this._logger.error('ElasticSearch search failed:', error);
      return [];
    }
  }
}
