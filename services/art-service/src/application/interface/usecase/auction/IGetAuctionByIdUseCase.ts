import { Auction } from "../../../../domain/entities/Auction";

export interface IGetAuctionByIdUseCase {
  execute(id: string): Promise<Auction | null>;
}
