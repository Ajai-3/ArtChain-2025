import { ProcessPaymentDTO } from "../../dto/transaction/ProcessPaymentDTO";

export interface IProcessPaymentUseCase {
  execute(dto: ProcessPaymentDTO): Promise<boolean>;
}
