import { WithdrawalRequest } from "../../../../domain/entities/WithdrawalRequest";
import { CreateWithdrawalRequestDTO } from "../../dto/withdrawal/CreateWithdrawalRequestDTO";

export interface ICreateWithdrawalRequestUseCase {
  execute(dto: CreateWithdrawalRequestDTO): Promise<{ withdrawalRequest: WithdrawalRequest; wallet: any }>;
}
