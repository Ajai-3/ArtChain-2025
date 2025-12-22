import { SettleAuctionDTO } from "../../dto/wallet/SettleAuctionDTO";

export interface ISettleAuctionUseCase {
  execute(dto: SettleAuctionDTO): Promise<boolean>;
}
