import { ArtistRequest } from '@prisma/client';
import { CreateArtistRequestDto } from '../../../dtos/user/artist-request/CreateArtistRequestDto';

export interface ICreateArtistRequestUseCase {
  execute(data: CreateArtistRequestDto): Promise<ArtistRequest>;
}
