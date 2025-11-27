import axios from 'axios';
import { config } from '../config/env';

export class ElasticsearchClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.api_gateway_url;
  }

  async searchUsers(query: string): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/v1/elastic/admin/search`, {
        params: { q: query },
      });
      
      // Assuming the response contains an array of user IDs
      return response.data.userIds || [];
    } catch (error) {
      console.error('Error searching users in Elasticsearch:', error);
      return [];
    }
  }
}
