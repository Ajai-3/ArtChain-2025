import { mapCdnUrl } from '../../utils/mapCdnUrl';
import type { BiddingHistoryAuction, BiddingHistoryUser } from '../../types/bidding';

export const toBiddingHistoryResponse = (
  auction: BiddingHistoryAuction,
  host: BiddingHistoryUser | null,
  winner?: BiddingHistoryUser | null,
) => {
  return {
    auction: {
      id: auction.id || auction._id?.toString(),
      title: auction.title,
      description: auction.description,
      imageKey: auction.imageKey,
      imageUrl: auction.imageKey ? mapCdnUrl(auction.imageKey) : null,
      startTime: auction.startTime,
      endTime: auction.endTime,
      status: auction.status,
      startPrice: auction.startPrice,
      currentBid: auction.currentBid,
      winnerId: auction.winnerId,
    },
    host: host ? {
      id: host.id || host._id?.toString(),
      name: host.name,
      username: host.username,
      profileImage: host.profileImage ? mapCdnUrl(host.profileImage) : '',
    } : null,
    winner: winner ? {
      id: winner.id || winner._id?.toString(),
      name: winner.name,
      username: winner.username,
      profileImage: winner.profileImage ? mapCdnUrl(winner.profileImage) : '',
    } : null
  };
};