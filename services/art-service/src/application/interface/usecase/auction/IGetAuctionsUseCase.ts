import { GetAuctionsDTO } from "../../dto/auction/GetAuctionsDTO";

export interface IGetAuctionsUseCase {
  execute(dto: GetAuctionsDTO): Promise<{ auctions: any[]; total: number }>;
}
