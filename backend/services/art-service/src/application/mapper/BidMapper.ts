import { Bid } from '../../domain/entities/Bid';
import { BidResponseDTO } from '../interface/dto/bid/BidResponseDTO';
import { UserBidResponseDTO } from '../interface/dto/bid/UserBidResponseDTO';
import type { Auction } from '../../domain/entities/Auction';
import type { UserPublicProfile } from '../../types/user';

export class BidMapper {
  static toDTO(bid: Bid, bidder: UserPublicProfile | null | undefined): BidResponseDTO {
    return {
      id: bid._id ?? '',
      auctionId: bid.auctionId,
      amount: bid.amount,
      createdAt: bid.createdAt ?? new Date(),
      bidder: bidder ? {
        id: bidder.id ?? '',
        username: bidder.username ?? '',
        name: bidder.name ?? '',
        profileImage: bidder.profileImage ?? '',
        isVerified: bidder.isVerified ?? false
      } : null
    };
  }

  static toUserBidDTO(
    bid: Bid,
    auction: Auction | null,
    signedImageUrl: string,
  ): UserBidResponseDTO {
    return {
        id: bid._id ?? '',
        amount: bid.amount,
        createdAt: bid.createdAt ?? new Date(),
        auction: auction ? {
            id: auction._id ?? '',
            title: auction.title ?? '',
            status: auction.status ?? '',
            imageKey: signedImageUrl,
            endTime: auction.endTime ?? new Date()
        } : null
    };
  }
}
