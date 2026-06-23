import { SafeUser } from '../../../domain/entities/User';
import { ArtistRequest } from '../../../domain/entities/ArtistRequest';

export interface ApproveArtistResultResponse {
  user: SafeUser | null;
  request: ArtistRequest | null;
}