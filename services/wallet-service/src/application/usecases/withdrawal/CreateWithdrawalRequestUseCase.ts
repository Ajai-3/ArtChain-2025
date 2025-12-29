import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/inversify/types";
import { ICreateWithdrawalRequestUseCase } from "../../interface/usecase/withdrawal/ICreateWithdrawalRequestUseCase";
import { IWithdrawalRepository } from "../../../domain/repository/IWithdrawalRepository";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { WithdrawalRequest, WithdrawalMethod, WithdrawalStatus } from "../../../domain/entities/WithdrawalRequest";
import { TransactionType, TransactionCategory, TransactionMethod, TransactionStatus } from "../../../domain/entities/Transaction";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { prisma } from "../../../infrastructure/db/prisma";
import { CreateWithdrawalRequestDTO } from "../../interface/dto/withdrawal/CreateWithdrawalRequestDTO";
import { WALLET_MESSAGES } from "../../../constants/WalletMessages";
import { Wallet, WalletStatus } from "../../../domain/entities/Wallet";

@injectable()
export class CreateWithdrawalRequestUseCase implements ICreateWithdrawalRequestUseCase {
  constructor(
    @inject(TYPES.IWithdrawalRepository)
    private readonly _withdrawalRepository: IWithdrawalRepository,
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(dto: CreateWithdrawalRequestDTO): Promise<{ withdrawalRequest: WithdrawalRequest; wallet: Wallet }> {
    // Validate amount
    if (dto.amount < 100) {
      throw new BadRequestError(WALLET_MESSAGES.MINIMUM_WITHDRAWAL_NOT_MET);
    }

    if (dto.amount > 1000000) {
      throw new BadRequestError(WALLET_MESSAGES.MAXIMUM_WITHDRAWAL_EXCEEDED);
    }

    if (dto.method !== WithdrawalMethod.BANK_TRANSFER && dto.method !== WithdrawalMethod.UPI) {
      throw new BadRequestError(WALLET_MESSAGES.INVALID_PAYMENT_METHOD);
    }

    if (dto.method === WithdrawalMethod.BANK_TRANSFER) {
      if (!dto.accountHolderName || !dto.accountNumber || !dto.ifscCode) {
        throw new BadRequestError(WALLET_MESSAGES.INVALID_BANK_DETAILS);
      }
    } else if (dto.method === WithdrawalMethod.UPI) {
      if (!dto.upiId) {
        throw new BadRequestError(WALLET_MESSAGES.INVALID_UPI_ID);
      }
    }

    const wallet = await this._walletRepository.getByUserId(dto.userId);
    if (!wallet) {
      throw new NotFoundError(WALLET_MESSAGES.WALLET_NOT_FOUND);
    }

    if (wallet.status === WalletStatus.LOCKED) {
      throw new BadRequestError(WALLET_MESSAGES.WALLET_LOCKED);
    }

    if (wallet.status === WalletStatus.SUSPENDED) {
      throw new BadRequestError(WALLET_MESSAGES.WALLET_SUSPENDED);
    }

    if (wallet.balance < dto.amount) {
      throw new BadRequestError(WALLET_MESSAGES.INSUFFICIENT_BALANCE);
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            decrement: dto.amount,
          },
          lockedAmount: {
            increment: dto.amount,
          },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: TransactionType.DEBITED,
          category: TransactionCategory.WITHDRAWAL,
          amount: dto.amount,
          method: TransactionMethod.ART_COIN,
          status: TransactionStatus.PENDING,
          description: `Withdrawal request - ${dto.method === WithdrawalMethod.BANK_TRANSFER ? "Bank Transfer" : "UPI"}`,
          meta: {
            withdrawalMethod: dto.method,
            ...(dto.method === WithdrawalMethod.BANK_TRANSFER
              ? { accountHolderName: dto.accountHolderName, accountNumber: dto.accountNumber, ifscCode: dto.ifscCode }
              : { upiId: dto.upiId }),
          },
        },
      });

      const withdrawalRequest = await tx.withdrawalRequest.create({
        data: {
          userId: dto.userId,
          walletId: wallet.id,
          amount: dto.amount,
          method: dto.method as any,
          accountHolderName: dto.accountHolderName,
          accountNumber: dto.accountNumber,
          ifscCode: dto.ifscCode,
          upiId: dto.upiId,
          transactionId: transaction.id,
          status: WithdrawalStatus.PENDING,
        },
      });

      return {
        withdrawalRequest,
        transaction,
        updatedWallet,
      };
    });

    return {
      withdrawalRequest: result.withdrawalRequest as WithdrawalRequest,
      wallet: result.updatedWallet,
    };
  }
}
