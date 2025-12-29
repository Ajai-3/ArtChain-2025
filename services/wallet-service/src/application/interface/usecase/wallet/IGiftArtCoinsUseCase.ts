import { GiftArtCoinsDTO } from "../../dto/wallet/GiftArtCoinsDTO";

export interface IGiftArtCoinsUseCase {
  execute(data: GiftArtCoinsDTO): Promise<{newBalance: number; lockedAmount: number; }>;
}