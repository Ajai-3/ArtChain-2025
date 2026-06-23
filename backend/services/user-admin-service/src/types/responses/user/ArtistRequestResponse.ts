import { ArtistRequestWithUser } from '../../common.types';

export interface GetArtistRequestsResponse {
  meta: { page: number; limit: number; total: number };
  data: ArtistRequestWithUser[];
}