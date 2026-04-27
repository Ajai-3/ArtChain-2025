import type { SaledArtworksResponse } from '../../../../types/usecase-response';

export interface ISaledArtworkOfuserUseCase {
    execute(userId: string, page: number, limit: number): Promise<SaledArtworksResponse>;
}