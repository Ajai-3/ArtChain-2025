import { LockFundsDTO } from "../../dto/wallet/LockFundsDTO";

export interface ILockFundsUseCase {
  execute(dto: LockFundsDTO): Promise<boolean>;
}
