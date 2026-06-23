import { IBaseRepository } from '../IBaseRepository';
import { ArtistRequest } from '../../entities/ArtistRequest';
import { GetArtistRequestsResponse } from '../../../types/responses/user/ArtistRequestResponse';

export interface IArtistRequestRepository
  extends IBaseRepository<ArtistRequest> {
  findById(id: string): Promise<ArtistRequest | null>;
  createArtistRequest(
    data: Omit<ArtistRequest, 'id' | 'createdAt' | 'reviewedAt'>
  ): Promise<ArtistRequest>;

  approve(requestId: string): Promise<ArtistRequest>;
  reject(requestId: string, reason: string): Promise<ArtistRequest>;
  getPendingRequests(): Promise<ArtistRequest[]>;
  getByUser(userId: string): Promise<ArtistRequest[]>;

  getArtistRequests(page: number, limit: number): Promise<GetArtistRequestsResponse>;
}
