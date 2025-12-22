import { Commission } from "../../domain/entities/Commission";
import { mapCdnUrl } from "../../utils/mapCdnUrl";

export class CommissionMapper {
  static toDTO(commission: Commission, requester?: any, artist?: any) {
    return {
      id: commission._id,
      requesterId: commission.requesterId,
      artistId: commission.artistId,
      conversationId: commission.conversationId,
      title: commission.title,
      description: commission.description,
      budget: commission.budget,
      deadline: commission.deadline,
      status: commission.status,
      referenceImages: (commission.referenceImages || []).map(img => mapCdnUrl(img)),
      finalArtwork: mapCdnUrl(commission.finalArtwork),
      history: commission.history,
      lastUpdatedBy: commission.lastUpdatedBy,
      amount: commission.amount,
      platformFee: commission.platformFee,
      deliveryDate: commission.deliveryDate,
      autoReleaseDate: commission.autoReleaseDate,
      disputeReason: commission.disputeReason,
      platformFeePercentage: commission.platformFeePercentage,
      createdAt: commission.createdAt,
      updatedAt: commission.updatedAt,
      requester: requester ? {
        id: requester.id,
        name: requester.name,
        username: requester.username,
        profileImage: requester.profileImage,
      } : null,
      artist: artist ? {
        id: artist.id,
        name: artist.name,
        username: artist.username,
        profileImage: artist.profileImage,
      } : null,
    };
  }

  static toCollectionDTO(commissions: Commission[]) {
    return commissions.map(c => this.toDTO(c));
  }
}
