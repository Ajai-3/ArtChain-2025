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

  async getTopArts(token: string, limit: number = 5, type: 'likes' | 'price' = 'likes'): Promise<any[]> {
    try {
      const res = await axios.get(`${this.baseUrl}/api/v1/art/admin/art/stats/top`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit, type }
      });
      return res.data.data;
    } catch (err) {
      console.error('Error getting top arts:', err);
      return [];
    }
  }

  async getCategoryStats(token: string): Promise<any[]> {
    try {
        const res = await axios.get(`${this.baseUrl}/api/v1/art/admin/art/stats/categories`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.data;
    } catch (err) {
        console.error('Error getting category stats:', err);
        return [];
    }
  }

  async getRecentAuctions(token: string, limit: number = 5): Promise<any[]> {
      try {
          const res = await axios.get(`${this.baseUrl}/api/v1/art/admin/auctions/recent`, {
              headers: { Authorization: `Bearer ${token}` },
              params: { limit }
          });
          return res.data.data;
      } catch (err) {
          console.error('Error getting recent auctions:', err);
          return [];
      }
  }

  async getRecentCommissions(token: string, limit: number = 5): Promise<any[]> {
      try {
          const res = await axios.get(`${this.baseUrl}/api/v1/art/admin/commissions/recent`, {
              headers: { Authorization: `Bearer ${token}` },
              params: { limit }
          });
          return res.data.data;
      } catch (err) {
          console.error('Error getting recent commissions:', err);
          return [];
      }
  }

  async getArtworkCounts(token: string): Promise<any> {
    try {
        const res = await axios.get(`${this.baseUrl}/api/v1/art/admin/art/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.data;
    } catch (err) {
        console.error('Error getting artwork counts:', err);
        return { total: 0, free: 0, premium: 0, aiGenerated: 0 };
    }
  }

  async getAuctionCounts(token: string): Promise<any> {
    try {
        const res = await axios.get(`${this.baseUrl}/api/v1/art/admin/auctions/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.data;
    } catch (err) {
        console.error('Error getting auction counts:', err);
        return { active: 0, ended: 0, sold: 0, unsold: 0 };
    }
  }

  async getCommissionCounts(token: string): Promise<any> {
    try {
        const res = await axios.get(`${this.baseUrl}/api/v1/art/admin/commissions/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data.data;
    } catch (err) {
        console.error('Error getting commission counts:', err);
        return { REQUESTED: 0, AGREED: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    }
  }
}
