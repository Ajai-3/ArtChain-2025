import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { IGetDashboardStatsUseCase } from '../../../interface/usecases/admin/IGetDashboardStatsUseCase';
import { IArtService } from '../../../interface/http/IArtService';
import { IWalletService } from '../../../interface/http/IWalletService';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { mapCdnUrl } from '../../../../utils/mapCdnUrl';
import {
  ArtTopItem,
  CategoryStat,
  AuctionItem,
  CommissionItem,
  TransactionItem,
  DashboardStats,
} from '../../../../types';
import { ArtUser } from '../../../../types/ArtUser';
import {
  AuctionCountStats,
  CommissionCountStats,
} from '../../../../types/art.types';

@injectable()
export class GetDashboardStatsUseCase implements IGetDashboardStatsUseCase {
  constructor(
    @inject(TYPES.IArtService) private readonly _artService: IArtService,
    @inject(TYPES.IWalletService)
    private readonly _walletService: IWalletService,
    @inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(token: string): Promise<DashboardStats> {
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
      transactionStats,
    ] = await Promise.all([
      this._artService.getTopArts(token, 5, 'likes'),
      this._artService.getCategoryStats(token),
      this._artService.getRecentAuctions(token, 5),
      this._artService.getRecentCommissions(token, 5),
      this._walletService.getRecentTransactions(token, 5),
      this._userRepository.findAllUsers({ page: 1, limit: 1 }),
      this._userRepository.findAllUsers({ page: 1, limit: 1, role: 'artist' }),
      this._userRepository.findAllUsers({
        page: 1,
        limit: 1,
        status: 'banned',
      }),
      this._artService.getArtworkCounts(token),
      this._artService.getAuctionCounts(token, 'all'),
      this._artService.getCommissionCounts(token, 'all'),
      this._walletService.getTransactionStats(token),
    ]);

    const categoryStats = rawCategoryStats.filter(
      (c: CategoryStat) => c.category && c.category !== 'Uncategorized',
    );

    const artistIds = [
      ...new Set(rawTopArts.map((art: ArtTopItem) => art.userId)),
    ];
    const topArtUsers =
      await this._userRepository.findManyByIdsBatch(artistIds);
    const userMap = new Map(topArtUsers.map((u: ArtUser) => [u.id, u]));

    const topArts = rawTopArts.map((art: ArtTopItem) => {
      const user = userMap.get(art.userId);
      return {
        ...art,
        previewUrl: mapCdnUrl(art.imageUrl),
        artist: {
          name: user?.name || 'Unknown',
          username: user?.username || 'unknown',
          profileImage: user?.profileImage ? mapCdnUrl(user.profileImage) : '',
        },
      };
    });

    const hostIds = [
      ...new Set(rawRecentAuctions.map((auc: AuctionItem) => auc.hostId)),
    ];
    const hostUsers = await this._userRepository.findManyByIdsBatch(hostIds);
    const hostMap = new Map(hostUsers.map((u: ArtUser) => [u.id, u]));

    const recentAuctions = rawRecentAuctions.map((auc: AuctionItem) => {
      const host = hostMap.get(auc.hostId);

      return {
        ...auc,
        imageKey: mapCdnUrl(auc.imageUrl),
        host: host
          ? {
              name: host.name,
              username: host.username,
              profileImage: host.profileImage
                ? mapCdnUrl(host.profileImage)
                : '',
            }
          : { name: 'Unknown Host', username: 'unknown', profileImage: '' },
        startPrice: auc.currentBid,
      };
    });

    const commArtistIds = recentCommissions.map(
      (c: CommissionItem) => c.artistId,
    );
    const commClientIds = recentCommissions.map(
      (c: CommissionItem) => c.requesterId,
    );
    const allCommUserIds = [...new Set([...commArtistIds, ...commClientIds])];

    let commUserMap = new Map<string, ArtUser>();
    if (allCommUserIds.length > 0) {
      const commUsers =
        await this._userRepository.findManyByIdsBatch(allCommUserIds);
      commUserMap = new Map(commUsers.map((u: ArtUser) => [u.id, u]));
    }

    const populatedCommissions = recentCommissions.map((c: CommissionItem) => ({
      id: c.id,
      amount: 0,
      status: c.status,
      artistName: commUserMap.get(c.artistId)?.name || 'Unknown Artist',
      artistUsername: commUserMap.get(c.artistId)?.username,
      artistProfileImage: mapCdnUrl(commUserMap.get(c.artistId)?.profileImage) ?? null,
      clientName: commUserMap.get(c.requesterId)?.name || 'Unknown Client',
      clientUsername: commUserMap.get(c.requesterId)?.username,
      clientProfileImage: mapCdnUrl(commUserMap.get(c.requesterId)?.profileImage) ?? null,
      requestMessage: '',
      createdAt: new Date().toISOString(),
    }));

    const txUserIds = [
      ...new Set(
        recentTransactions
          .map((tx: TransactionItem) => tx.userId)
          .filter((id): id is string => !!id),
      ),
    ];
    let txUserMap = new Map<string, ArtUser>();
    if (txUserIds.length > 0) {
      const txUsers = await this._userRepository.findManyByIdsBatch(txUserIds);
      txUserMap = new Map(txUsers.map((u: ArtUser) => [u.id, u]));
    }

    const populatedTransactions = recentTransactions.map(
      (tx: TransactionItem) => {
        const user = txUserMap.get(tx.userId || '');
        return {
          ...tx,
          user: user
            ? {
                username: user.username,
                name: user.name,
                profileImage: user.profileImage
                  ? mapCdnUrl(user.profileImage)
                  : '',
              }
            : null,
        };
      },
    );

    const totalUsers = totalUsersData.meta.total;
    const totalArtists = artistsData.meta.total;
    const totalBanned = bannedData.meta.total;

    const finalAuctionCounts: AuctionCountStats = auctionCounts?.overall || {
      active: 0,
      ended: 0,
      sold: 0,
      unsold: 0,
    };
    const finalCommissionCounts: CommissionCountStats = {
      REQUESTED:
        commissionCounts?.REQUESTED ??
        commissionCounts?.overall?.REQUESTED ??
        0,
      AGREED:
        commissionCounts?.AGREED ?? commissionCounts?.overall?.AGREED ?? 0,
      IN_PROGRESS:
        commissionCounts?.IN_PROGRESS ??
        commissionCounts?.overall?.IN_PROGRESS ??
        0,
      COMPLETED:
        commissionCounts?.COMPLETED ??
        commissionCounts?.overall?.COMPLETED ??
        0,
      CANCELLED:
        commissionCounts?.CANCELLED ??
        commissionCounts?.overall?.CANCELLED ??
        0,
    };

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
        banned: totalBanned,
      },
      artworkCounts,
      auctionCounts: finalAuctionCounts,
      commissionCounts: finalCommissionCounts,
      transactionStats: transactionStats || {
        totalAmount: 0,
        transactionCount: 0,
        byCategory: {},
      },
    };
  }
}
