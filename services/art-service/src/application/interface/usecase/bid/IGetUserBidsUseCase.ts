import { UserBidResponseDTO } from "../../dto/bid/UserBidResponseDTO";

export interface IGetUserBidsUseCase {
  execute(userId: string): Promise<UserBidResponseDTO[]>;
}
