import { Auction } from "../../../../domain/entities/Auction";

export interface IGetRecentAuctionsUseCase {
  execute(limit: number): Promise<Auction[]>;
}
