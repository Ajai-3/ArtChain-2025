import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IUpdateWithdrawalStatusUseCase } from "../../interface/usecase/withdrawal/IUpdateWithdrawalStatusUseCase";
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
    const validStatuses = Object.values(WithdrawalStatus);
    if (!validStatuses.includes(dto.status as WithdrawalStatus)) {
      throw new BadRequestError(WALLET_MESSAGES.INVALID_WITHDRAWAL_STATUS);
    }

    const existingWithdrawal = await this._withdrawalRepository.getWithdrawalRequestById(dto.withdrawalId);
    if (!existingWithdrawal) {
      throw new BadRequestError(WALLET_MESSAGES.WITHDRAWAL_REQUEST_NOT_FOUND);
    }

    if (
      existingWithdrawal.status === WithdrawalStatus.COMPLETED ||
      existingWithdrawal.status === WithdrawalStatus.REJECTED ||
      existingWithdrawal.status === WithdrawalStatus.FAILED
    ) {
      throw new BadRequestError(WALLET_MESSAGES.WITHDRAWAL_ALREADY_PROCESSED);
    }

    if (dto.status === WithdrawalStatus.REJECTED && !dto.rejectionReason) {
      throw new BadRequestError(WALLET_MESSAGES.REJECTION_REASON_REQUIRED);
    }


    if (existingWithdrawal.status === WithdrawalStatus.PENDING) {
      return this._withdrawalRepository.processWithdrawal({
        withdrawalId: dto.withdrawalId,
        status: dto.status,
        amount: existingWithdrawal.amount,
        walletId: existingWithdrawal.walletId,
        rejectionReason: dto.rejectionReason,
        originalTransactionId: existingWithdrawal.transactionId || undefined
      });
    } else {
      return this._withdrawalRepository.updateStatus(
        dto.withdrawalId,
        dto.status,
        dto.rejectionReason
      );
    }
  }
}
