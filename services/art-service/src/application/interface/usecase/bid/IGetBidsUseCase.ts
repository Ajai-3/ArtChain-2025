import { BidResponseDTO } from "../../dto/bid/BidResponseDTO";

export interface IGetBidsUseCase {
  execute(auctionId: string): Promise<BidResponseDTO[]>;
}
