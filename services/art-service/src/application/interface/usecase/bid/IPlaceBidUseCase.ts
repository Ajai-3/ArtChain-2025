import { Bid } from "../../../../domain/entities/Bid";

export interface IPlaceBidUseCase {
  execute(auctionId: string, bidderId: string, amount: number): Promise<Bid>;
}
