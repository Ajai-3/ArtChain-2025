import { WalletSummaryResponse } from '../../../../types/Wallet';

export interface IGetWalletUseCase {
    execute(userId: string): Promise<WalletSummaryResponse>;
}