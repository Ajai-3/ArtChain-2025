import axios from 'axios';
import { injectable } from 'inversify';
import { config } from '../config/env';
import { IS3Service } from '../../domain/interfaces/IS3Service';

@injectable()
export class S3Service implements IS3Service {
  private url = config.api_gateway_url;

  constructor() {}

  async getSignedUrl(
    key: string,
    category: string,
    fileName: string,
  ): Promise<string> {
    try {
      const url = `${this.url}/api/v1/upload/signed-url?key=${key}&category=${category}&fileName=${fileName}`;
      const response = await axios.get(url);

      // console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating signed URL:', error);
      throw error;
    }
  }
}
