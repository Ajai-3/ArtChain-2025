import type { GetArtByNameResponse } from '../../../../types/usecase-response';

export interface IGetArtByNameUseCase {
    execute(artName: string, currentUserId: string): Promise<GetArtByNameResponse>;
}