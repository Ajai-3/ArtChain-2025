import { GetAllWithdrawalsResponse } from '../../../../types/Withdrawal';

export interface IGetAllWithdrawalRequestsUseCase {
  execute(page?: number, limit?: number, token?: string, status?: string): Promise<GetAllWithdrawalsResponse>;
}
