import { BidResponseDTO } from "../../dto/bid/BidResponseDTO";
import { PlaceBidDTO } from "../../dto/bid/PlaceBidDTO";

export interface IPlaceBidUseCase {
  execute(data: PlaceBidDTO): Promise<BidResponseDTO>;
}
