import { WithdrawalRequest } from "../../../../domain/entities/WithdrawalRequest";

export interface IGetAllWithdrawalRequestsUseCase {
  execute(page?: number, limit?: number, token?: string, status?: string): Promise<any>; // Returns withdrawal requests with user information
}
