import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IUpdateWithdrawalStatusUseCase } from "../../interface/usecases/withdrawal/IUpdateWithdrawalStatusUseCase";
import { IWithdrawalRepository } from "../../../domain/repository/IWithdrawalRepository";
import { WithdrawalRequest, WithdrawalStatus } from "../../../domain/entities/WithdrawalRequest";
import { UpdateWithdrawalStatusDTO } from "../../interface/dto/withdrawal/UpdateWithdrawalStatusDTO";
import { BadRequestError } from "art-chain-shared";
import { WALLET_MESSAGES } from "../../../constants/WalletMessages";

@injectable()
export class UpdateWithdrawalStatusUseCase implements IUpdateWithdrawalStatusUseCase {
  constructor(
    @inject(TYPES.IWithdrawalRepository)
    private readonly _withdrawalRepository: IWithdrawalRepository
  ) {}

  async execute(dto: UpdateWithdrawalStatusDTO): Promise<WithdrawalRequest> {
    // Validate status
    const validStatuses = Object.values(WithdrawalStatus);
    if (!validStatuses.includes(dto.status as WithdrawalStatus)) {
      throw new BadRequestError("Invalid withdrawal status");
    }

    // Get existing withdrawal request
    const existingWithdrawal = await this._withdrawalRepository.getWithdrawalRequestById(dto.withdrawalId);
    if (!existingWithdrawal) {
      throw new BadRequestError(WALLET_MESSAGES.WITHDRAWAL_REQUEST_NOT_FOUND);
    }

    // Check if already processed
    if (
      existingWithdrawal.status === WithdrawalStatus.COMPLETED ||
      existingWithdrawal.status === WithdrawalStatus.REJECTED
    ) {
      throw new BadRequestError(WALLET_MESSAGES.WITHDRAWAL_ALREADY_PROCESSED);
    }

    // If rejecting, require rejection reason
    if (dto.status === WithdrawalStatus.REJECTED && !dto.rejectionReason) {
      throw new BadRequestError("Rejection reason is required");
    }

    // Update withdrawal status
    const updatedWithdrawal = await this._withdrawalRepository.updateStatus(
      dto.withdrawalId,
      dto.status as WithdrawalStatus,
      dto.rejectionReason
    );

    return updatedWithdrawal;
  }
}
