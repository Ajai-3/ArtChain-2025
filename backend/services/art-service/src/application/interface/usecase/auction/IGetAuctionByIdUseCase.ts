import { GetAuctionByIdDTO } from '../../dto/auction/GetAuctionByIdDTO';
import type { AuctionDTO } from '../../../../types/auction';

export interface IGetAuctionByIdUseCase {
  execute(dto: GetAuctionByIdDTO): Promise<AuctionDTO | null>;
}
