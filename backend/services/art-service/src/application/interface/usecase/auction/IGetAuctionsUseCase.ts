import { GetAuctionsDTO } from '../../dto/auction/GetAuctionsDTO';
import type { AuctionDTO } from '../../../../types/auction';

export interface IGetAuctionsUseCase {
  execute(dto: GetAuctionsDTO): Promise<{ auctions: AuctionDTO[]; total: number }>;
}
