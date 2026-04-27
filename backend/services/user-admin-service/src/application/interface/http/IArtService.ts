import { ArtTopItem, CategoryStat, AuctionItem, CommissionItem, ArtworkCountStats, AuctionCountStats, CommissionCountStats, ArtComment } from '../../../types/art.types';

export interface IArtService {
    getUserArtCount(userId: string): Promise<number>;
    getTopArts(token: string, limit?: number, type?: 'likes' | 'price'): Promise<ArtTopItem[]>;
    getCategoryStats(token: string): Promise<CategoryStat[]>;
    getRecentAuctions(token: string, limit?: number): Promise<AuctionItem[]>;
    getRecentCommissions(token: string, limit?: number): Promise<CommissionItem[]>;
    getArtworkCounts(token: string): Promise<ArtworkCountStats>;
    getAuctionCounts(token: string, timeRange?: string): Promise<AuctionCountStats>;
    getCommissionCounts(token: string, timeRange?: string): Promise<CommissionCountStats>;
    updateArtStatus(token: string, artId: string, status: string): Promise<{ success: boolean }>;
    deleteComment(token: string, commentId: string): Promise<{ success: boolean }>;
    getArt(token: string, artId: string): Promise<Record<string, unknown>>;
    getComment(token: string, commentId: string): Promise<ArtComment>;
}