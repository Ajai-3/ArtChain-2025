import { Auction } from "../../../../domain/entities/Auction";

export interface IGetAuctionsUseCase {
  execute(page?: number, limit?: number): Promise<Auction[]>;
}
