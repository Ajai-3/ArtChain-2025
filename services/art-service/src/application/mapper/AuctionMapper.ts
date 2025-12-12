import { Auction } from "../../domain/entities/Auction";
import { Bid } from "../../domain/entities/Bid";

export class AuctionMapper {
  static toDTO(
    auction: Auction,
    signedImageUrl: string,
    host: any,
    bids: Bid[],
    bidderMap: Map<string, any>
  ) {
    const enrichedBids = bids.map((bid) => {
      const bidder = bidderMap.get(bid.bidderId);
      return {
        id: bid._id,
        auctionId: bid.auctionId,
        amount: bid.amount,
        createdAt: bid.createdAt,
        bidder: bidder
          ? {
              id: bidder.id,
              username: bidder.username,
            name: bidder.name,
              profileImage: bidder.profileImage, 
              isVerified: bidder.isVerified,
              role: bidder.role
            }
          : null,
      };
    });

    const winner = auction.winnerId ? bidderMap.get(auction.winnerId) : null;

    return {
      id: auction._id,
      title: auction.title,
      description: auction.description,
      startPrice: auction.startPrice,
      currentBid: auction.currentBid,
      startTime: auction.startTime,
      endTime: auction.endTime,
      status: auction.status,
      imageKey: signedImageUrl,
      host: host
        ? {
            id: host.id,
            username: host.username,
            name: host.name,
            profileImage: host.profileImage,
            isVerified: host.isVerified,
            role: host.role
          }
        : null,
      bids: enrichedBids,
      winner: winner 
        ? {
            id: winner.id,
            username: winner.username,
            name: winner.name,
            profileImage: winner.profileImage,
            isVerified: winner.isVerified,
            role: winner.role
        }
        : null,
      winnerId: auction.winnerId,
      createdAt: auction.createdAt,
      updatedAt: auction.updatedAt,
    };
  }
}
