import { injectable, inject } from "inversify";
import { IProcessPaymentUseCase } from "../../interface/usecase/transaction/IProcessPaymentUseCase";
import { ProcessPaymentDTO } from "../../interface/dto/transaction/ProcessPaymentDTO";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { logger } from "../../../utils/logger";

@injectable()
export class ProcessPaymentUseCase implements IProcessPaymentUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(dto: ProcessPaymentDTO): Promise<boolean> {
    logger.info(
      `Processing payment: From=${dto.payerId}, To=${dto.payeeId}, Amount=${dto.amount}, Ref=${dto.referenceId}`
    );

    return this._walletRepository.transferFunds(
      dto.payerId,
      dto.payeeId,
      dto.amount,
      dto.description,
      dto.referenceId,
      dto.category || "PAYMENT"
    );
  }
}
