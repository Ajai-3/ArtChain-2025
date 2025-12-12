import { GetAuctionByIdDTO } from "../../dto/auction/GetAuctionByIdDTO";

export interface IGetAuctionByIdUseCase {
  execute(dto: GetAuctionByIdDTO): Promise<any | null>;
}
