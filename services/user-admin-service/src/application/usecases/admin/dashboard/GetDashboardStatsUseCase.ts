import { injectable, inject } from "inversify";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { IGetDashboardStatsUseCase } from "../../../interface/usecases/admin/IGetDashboardStatsUseCase";
import { IArtService } from "../../../interface/http/IArtService";
import { IWalletService } from "../../../interface/http/IWalletService";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";

@injectable()
export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
  constructor(
    @inject(TYPES.IArtService) private readonly _artService: IArtService,
    @inject(TYPES.IWalletService) private readonly _walletService: IWalletService,
    @inject(TYPES.IUserRepository) private readonly _userRepository: IUserRepository
  ) {}

  async execute(token: string): Promise<any> {
    const [
      rawTopArts,
      rawCategoryStats,
      rawRecentAuctions,
      recentCommissions,
      recentTransactions,
      totalUsersData,
      artistsData,
      bannedData,
      artworkCounts,
      auctionCounts,
      commissionCounts,
      transactionStats
    ] = await Promise.all([
      this._artService.getTopArts(token, 5, 'likes'),
      this._artService.getCategoryStats(token),
      this._artService.getRecentAuctions(token, 5),
      this._artService.getRecentCommissions(token, 5),
      this._walletService.getRecentTransactions(token, 5),
      this._userRepository.findAllUsers({ page: 1, limit: 1 }), 
      this._userRepository.findAllUsers({ page: 1, limit: 1, role: 'artist' }), 
      this._userRepository.findAllUsers({ page: 1, limit: 1, status: 'banned' }), 
      this._artService.getArtworkCounts(token),
      this._artService.getAuctionCounts(token, 'all'),
      this._artService.getCommissionCounts(token, 'all'),
      this._walletService.getTransactionStats(token)
    ]);

    const categoryStats = rawCategoryStats.filter((c: any) => c.category && c.category !== 'Uncategorized');

    const artistIds = [...new Set(rawTopArts.map((art: any) => art.userId))];
    const topArtUsers = await this._userRepository.findManyByIdsBatch(artistIds);
    const userMap = new Map(topArtUsers.map((u: any) => [u.id, u]));

    const topArts = rawTopArts.map((art: any) => ({
      ...art,
      artist: userMap.get(art.userId) || { name: 'Unknown', username: 'unknown' }
    }));

    const hostIds = [...new Set(rawRecentAuctions.map((auc: any) => auc.hostId))];
    const hostUsers = await this._userRepository.findManyByIdsBatch(hostIds);
    const hostMap = new Map(hostUsers.map((u: any) => [u.id, u]));

    const recentAuctions = rawRecentAuctions.map((auc: any) => ({
      ...auc,
      host: hostMap.get(auc.hostId),
      startPrice: auc.startPrice 
    }));

    const commArtistIds = recentCommissions.map((c: any) => c.artistId);
    const commClientIds = recentCommissions.map((c: any) => c.requesterId);
    const allCommUserIds = [...new Set([...commArtistIds, ...commClientIds])];
    
    let commUserMap = new Map();
    if (allCommUserIds.length > 0) {
        const commUsers = await this._userRepository.findManyByIdsBatch(allCommUserIds);
        commUserMap = new Map(commUsers.map((u: any) => [u.id, u]));
    }

    const populatedCommissions = recentCommissions.map((c: any) => ({
        id: c._id || c.id,
        amount: c.budget || c.price || 0,
        status: c.status,
        artistName: commUserMap.get(c.artistId)?.name || 'Unknown Artist',
        artistProfileImage: commUserMap.get(c.artistId)?.profileImage,
        clientName: commUserMap.get(c.requesterId)?.name || 'Unknown Client',
        clientProfileImage: commUserMap.get(c.requesterId)?.profileImage,
        requestMessage: c.requestMessage,
        createdAt: c.createdAt
    }));
    
    const txUserIds = [...new Set(recentTransactions.map((tx: any) => tx.userId))];
    let txUserMap = new Map();
    if (txUserIds.length > 0) {
        const txUsers = await this._userRepository.findManyByIdsBatch(txUserIds);
        txUserMap = new Map(txUsers.map((u: any) => [u.id, u]));
    }
    
    const populatedTransactions = recentTransactions.map((tx: any) => {
        const user = txUserMap.get(tx.userId);
        return {
            ...tx,
            user: user ? {
                username: user.username,
                name: user.name,
                profileImage: user.profileImage
            } : null
        };
    });
    
    const totalUsers = totalUsersData.meta.total;
    const totalArtists = artistsData.meta.total;
    const totalBanned = bannedData.meta.total;

    return {
      topArts,
      categoryStats,
      recentAuctions,
      recentCommissions: populatedCommissions,
      recentTransactions: populatedTransactions,
      userCounts: {
        total: totalUsers,
        users: totalUsers - totalArtists, 
        artists: totalArtists,
        banned: totalBanned
      },
      artworkCounts,
      auctionCounts: auctionCounts?.overall || auctionCounts || { active: 0, ended: 0, sold: 0, unsold: 0 },
      commissionCounts: commissionCounts?.overall || commissionCounts || { REQUESTED: 0, AGREED: 0, IN_PROGRESS: 0, COMPLETED: 0 },
      transactionStats: transactionStats || []
    };
  }
}
