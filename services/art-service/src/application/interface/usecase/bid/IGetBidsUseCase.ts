import { BidResponseDTO } from "../../dto/bid/BidResponseDTO";

export interface IGetBidsUseCase {
  execute(auctionId: string, page?: number, limit?: number): Promise<{ bids: BidResponseDTO[]; total: number }>;
}
