import { Bid } from "../../domain/entities/Bid";
import { BidResponseDTO } from "../interface/dto/bid/BidResponseDTO";
import { UserBidResponseDTO } from "../interface/dto/bid/UserBidResponseDTO";

export class BidMapper {
  static toDTO(bid: Bid, bidder: any): BidResponseDTO {
    return {
      id: bid._id!,
      auctionId: bid.auctionId,
      amount: bid.amount,
      createdAt: bid.createdAt!,
      bidder: bidder ? {
        id: bidder.id,
        username: bidder.username,
        name: bidder.name,
        profileImage: bidder.profileImage,
        isVerified: bidder.isVerified
      } : null
    };
  }

  static toUserBidDTO(bid: any, auction: any, signedImageUrl: string): UserBidResponseDTO {
    return {
        id: bid._id,
        amount: bid.amount,
        createdAt: bid.createdAt,
        auction: auction ? {
            id: auction._id,
            title: auction.title,
            status: auction.status,
            imageKey: signedImageUrl,
            endTime: auction.endTime
        } : null
    };
  }
}
