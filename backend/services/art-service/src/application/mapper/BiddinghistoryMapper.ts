import { mapCdnUrl } from "../../utils/mapCdnUrl";

export const toBiddingHistoryResponse = (auction: any, host: any, winner?: any) => {
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