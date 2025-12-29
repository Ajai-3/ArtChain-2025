import { WithdrawalRequest } from "../../../../domain/entities/WithdrawalRequest";
import { UpdateWithdrawalStatusDTO } from "../../dto/withdrawal/UpdateWithdrawalStatusDTO";

export interface IUpdateWithdrawalStatusUseCase {
  execute(dto: UpdateWithdrawalStatusDTO): Promise<WithdrawalRequest>;
}
