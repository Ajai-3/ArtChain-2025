import { UnlockFundsDTO } from "../../dto/wallet/UnlockFundsDTO";

export interface IUnlockFundsUseCase {
  execute(dto: UnlockFundsDTO): Promise<boolean>;
}
