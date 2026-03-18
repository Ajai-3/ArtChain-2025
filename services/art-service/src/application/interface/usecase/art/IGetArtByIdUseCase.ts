import { ArtPost } from '../../../../domain/entities/ArtPost';

export interface IGetArtByIdUseCase {
    execute(id: string): Promise<{ art: ArtPost | null; user: any }>;
}