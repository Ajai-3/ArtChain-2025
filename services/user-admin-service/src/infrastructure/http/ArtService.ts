import axios from 'axios';
import { injectable } from 'inversify';
import { config } from '../config/env';
import { BadRequestError } from 'art-chain-shared';
import { IArtService } from '../../application/interface/http/IArtService';
import { ROUTES } from '../../constants/routes';

@injectable()
export class ArtService implements IArtService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.api_gateway_URL;
  }

  async getUserArtCount(userId: string): Promise<number> {
    try {
      const route = ROUTES.EXTERNAL.ART_COUNT.replace(':userId', userId);
      const res = await axios.get(`${this.baseUrl}${route}`);
      return res.data.artworksCount;
    } catch (err) {
      console.warn(
        `Warning: Could not fetch artwork count for user ${userId}. Returning 0.`
      );
      return 0;
    }
  }
}
