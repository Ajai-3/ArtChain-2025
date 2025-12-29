import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IGetWithdrawalRequestsUseCase } from "../../interface/usecase/withdrawal/IGetWithdrawalRequestsUseCase";
import { IWithdrawalRepository } from "../../../domain/repository/IWithdrawalRepository";
import { WithdrawalRequest } from "../../../domain/entities/WithdrawalRequest";
import { GetWithdrawalRequestsDTO } from "../../interface/dto/withdrawal/GetWithdrawalRequestsDTO";

@injectable()
export class GetWithdrawalRequestsUseCase implements IGetWithdrawalRequestsUseCase {
  constructor(
    @inject(TYPES.IWithdrawalRepository)
    private readonly _withdrawalRepository: IWithdrawalRepository
  ) {}

  async execute(dto: GetWithdrawalRequestsDTO): Promise<{ requests: WithdrawalRequest[]; total: number }> {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const status = dto.status;
    const method = dto.method;
    
    return await this._withdrawalRepository.getWithdrawalRequestsByUserId(dto.userId, page, limit, status, method);
  }
}
