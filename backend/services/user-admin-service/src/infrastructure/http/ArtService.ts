import axios from 'axios';
import { inject, injectable } from 'inversify';
import { config } from '../config/env';
import { BadRequestError } from 'art-chain-shared';
import { IArtService } from '../../application/interface/http/IArtService';
import { ROUTES } from '../../constants/routes';
import { TYPES } from '../inversify/types';
import { ILogger } from '../../application/interface/ILogger';

@injectable()
export class ArtService implements IArtService {
  private baseUrl: string;

  constructor(@inject(TYPES.ILogger) private readonly _logger: ILogger) {
    this.baseUrl = config.api_gateway_URL;
  }

  async getUserArtCount(userId: string): Promise<number> {
    try {
      const route = ROUTES.EXTERNAL.ART_COUNT.replace(':userId', userId);
      const res = await axios.get(`${this.baseUrl}${route}`);
      return res.data.artworksCount;
    } catch (err) {
      this._logger.warn(
        `Warning: Could not fetch artwork count for user ${userId}. Returning 0.`,
      );
      return 0;
    }
  }

  async getTopArts(
    token: string,
    limit: number = 5,
    type: 'likes' | 'price' = 'likes',
  ): Promise<any[]> {
    try {
      const res = await axios.get(`${this.baseUrl}${ROUTES.EXTERNAL.ART_TOP}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit, type },
      });
      return res.data.data;
    } catch (err) {
      this._logger.error('Error getting top arts:', err);
      return [];
    }
  }

  async getCategoryStats(token: string): Promise<any[]> {
    try {
      const res = await axios.get(
        `${this.baseUrl}${ROUTES.EXTERNAL.ART_CATEGORY}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data.data;
    } catch (err) {
      this._logger.error('Error getting category stats:', err);
      return [];
    }
  }

  async getRecentAuctions(token: string, limit: number = 5): Promise<any[]> {
    try {
      const res = await axios.get(
        `${this.baseUrl}${ROUTES.EXTERNAL.ART_AUCTION_RECENT}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit },
        },
      );
      return res.data.data;
    } catch (err) {
      this._logger.error('Error getting recent auctions:', err);
      return [];
    }
  }

  async getRecentCommissions(token: string, limit: number = 5): Promise<any[]> {
    try {
      const res = await axios.get(
        `${this.baseUrl}${ROUTES.EXTERNAL.ART_COMMISSION_RECENT}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit },
        },
      );
      return res.data.data;
    } catch (err) {
      this._logger.error('Error getting recent commissions:', err);
      return [];
    }
  }

  async getArtworkCounts(token: string): Promise<any> {
    try {
      const res = await axios.get(
        `${this.baseUrl}/api/v1/art/admin/art/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data.data;
    } catch (err) {
      this._logger.error('Error getting artwork counts:', err);
      return { total: 0, free: 0, premium: 0, aiGenerated: 0 };
    }
  }

  async getAuctionCounts(token: string, timeRange?: string): Promise<any> {
    try {
      const res = await axios.get(
        `${this.baseUrl}/api/v1/art/admin/auctions/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeRange },
        },
      );
      return res.data.data;
    } catch (err) {
      this._logger.error('Error getting auction counts:', err);
      return { active: 0, ended: 0, sold: 0, unsold: 0 };
    }
  }

  async getCommissionCounts(token: string, timeRange?: string): Promise<any> {
    try {
      const res = await axios.get(
        `${this.baseUrl}/api/v1/art/admin/commissions/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeRange },
        },
      );
      return res.data.data;
    } catch (err) {
      this._logger.error('Error getting commission counts:', err);
      return { REQUESTED: 0, AGREED: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    }
  }

  async updateArtStatus(
    token: string,
    artId: string,
    status: string,
  ): Promise<any> {
    try {
      const res = await axios.patch(
        `${this.baseUrl}/api/v1/art/admin/art/${artId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    } catch (err) {
      this._logger.error('Error updating art status:', err);
      throw err;
    }
  }

  async deleteComment(token: string, commentId: string): Promise<any> {
    try {
      const res = await axios.delete(
        `${this.baseUrl}/api/v1/art/admin/art/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    } catch (err) {
      this._logger.error('Error deleting comment:', err);
      throw err;
    }
  }

  async getArt(token: string, artId: string): Promise<any> {
    try {
      const res = await axios.get(`${this.baseUrl}/api/v1/art/${artId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      this._logger.error('Error fetching art:', err);
      throw err;
    }
  }

  async getComment(token: string, commentId: string): Promise<any> {
    try {
      const res = await axios.get(
        `${this.baseUrl}/api/v1/art/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    } catch (err) {
      this._logger.error('Error fetching comment:', err);
      throw err;
    }
  }
}
