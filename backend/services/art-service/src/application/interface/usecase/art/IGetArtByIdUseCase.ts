import { ArtPost } from '../../../../domain/entities/ArtPost';
import type { UserPublicProfile } from '../../../../types/user';

export interface IGetArtByIdUseCase {
  execute(id: string): Promise<{ art: ArtPost | null; user: UserPublicProfile | null }>;
}