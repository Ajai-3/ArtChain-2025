export interface IArtService {
    getUserArtCount(userId: string): Promise<number>;
    getTopArts(token: string, limit?: number, type?: 'likes' | 'price'): Promise<any[]>;
    getCategoryStats(token: string): Promise<any[]>;
    getRecentAuctions(token: string, limit?: number): Promise<any[]>;
    getRecentCommissions(token: string, limit?: number): Promise<any[]>;
    getArtworkCounts(token: string): Promise<any>;
    getAuctionCounts(token: string, timeRange?: string): Promise<any>;
    getCommissionCounts(token: string, timeRange?: string): Promise<any>;
    updateArtStatus(token: string, artId: string, status: string): Promise<any>;
    deleteComment(token: string, commentId: string): Promise<any>;
    getArt(token: string, artId: string): Promise<any>;
    getComment(token: string, commentId: string): Promise<any>;
}