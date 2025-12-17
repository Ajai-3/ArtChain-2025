import { WithdrawalRequest } from "../../../../domain/entities/WithdrawalRequest";
import { GetWithdrawalRequestsDTO } from "../../dto/withdrawal/GetWithdrawalRequestsDTO";

export interface IGetWithdrawalRequestsUseCase {
  execute(dto: GetWithdrawalRequestsDTO): Promise<{ requests: WithdrawalRequest[]; total: number }>;
}
