import { Auction } from "../../../../domain/entities/Auction";
import { CreateAuctionDTO } from "../../dto/auction/CreateAuctionDTO";

export interface ICreateAuctionUseCase {
  execute(data: CreateAuctionDTO): Promise<Auction>;
}
