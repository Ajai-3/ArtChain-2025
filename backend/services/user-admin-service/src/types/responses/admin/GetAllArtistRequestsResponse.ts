import { ArtistRequestWithUser } from '../../common.types';

export interface GetAllArtistRequestsResponse {
  meta: { page: number; limit: number; total: number };
  data: ArtistRequestWithUser[];
}