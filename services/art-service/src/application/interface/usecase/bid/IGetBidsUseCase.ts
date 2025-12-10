import { Bid } from "../../../../domain/entities/Bid";

export interface IGetBidsUseCase {
  execute(auctionId: string): Promise<Bid[]>;
}
