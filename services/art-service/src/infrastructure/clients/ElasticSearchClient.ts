import axios from 'axios';
import { injectable } from 'inversify';
import { config } from '../config/env';
import { IElasticSearchClient } from '../../application/interface/clients/IElasticSearchClient';

@injectable()
export class ElasticSearchClient implements IElasticSearchClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.api_gateway_url;
  }

  async searchArts(query: string): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/v1/elastic/admin/search/arts`, {
        params: { q: query },
      });
      return response.data.artIds || [];
    } catch (error) {
      console.error('Error searching arts in Elasticsearch:', error);
      return [];
    }
  }
}
