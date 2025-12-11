import { Bid } from "../../../../domain/entities/Bid";

export interface IGetUserBidsUseCase {
  execute(userId: string): Promise<any[]>;
}
