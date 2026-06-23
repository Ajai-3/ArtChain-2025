import { CreateWithdrawalRequestDTO } from '../../dto/withdrawal/CreateWithdrawalRequestDTO';
import { CreateWithdrawalResponse } from '../../../../types/Withdrawal';

export interface ICreateWithdrawalRequestUseCase {
  execute(dto: CreateWithdrawalRequestDTO): Promise<CreateWithdrawalResponse>;
}
