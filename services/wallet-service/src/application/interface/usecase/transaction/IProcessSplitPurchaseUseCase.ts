import { ProcessSplitPurchaseDTO } from "../../dto/transaction/ProcessSplitPurchaseDTO";

export interface IProcessSplitPurchaseUseCase {
  execute(dto: ProcessSplitPurchaseDTO): Promise<boolean>;
}
