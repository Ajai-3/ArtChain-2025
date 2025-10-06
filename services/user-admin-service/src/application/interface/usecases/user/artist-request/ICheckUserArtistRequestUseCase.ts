import { ArtistRequest } from '@prisma/client';

export interface ICheckUserArtistRequestUseCase {
  execute(
    userId: string
  ): Promise<{ alreadySubmitted: boolean; latestRequest?: ArtistRequest }>;
}
