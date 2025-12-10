import { Auction } from "../../../../domain/entities/Auction";

export interface ICreateAuctionUseCase {
  execute(data: any): Promise<Auction>;
}
