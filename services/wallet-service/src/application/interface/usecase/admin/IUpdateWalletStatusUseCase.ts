import { Wallet } from "../../../../domain/entities/Wallet";

export interface IUpdateWalletStatusUseCase {
  execute(
    walletId: string,
    status: 'active' | 'locked' | 'suspended'
  ): Promise<Wallet>;
}
