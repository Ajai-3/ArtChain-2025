import { ArtUser } from '../../../../../types/ArtUser';

export interface IGetUsersByIdsUserUseCase {
    execute(ids: string[], currentUserId?: string): Promise<ArtUser[]>
}