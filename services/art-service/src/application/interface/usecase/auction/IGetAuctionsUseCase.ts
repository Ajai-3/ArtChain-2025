import { Auction } from "../../../../domain/entities/Auction";

export interface IGetAuctionsUseCase {
  execute(
      page?: number, 
      limit?: number, 
      filterStatus?: string, 
      startDate?: Date,
      endDate?: Date
   ): Promise<Auction[]>;
}
