import { IBaseRepository } from "../IBaseRepository";
import { ArtistRequest } from "../../entities/ArtistRequest";

export interface IArtistRequestRepository
  extends IBaseRepository<ArtistRequest> {
  findById(id: string): Promise<ArtistRequest | null>;
  createArtistRequest(
    data: Omit<ArtistRequest, "id" | "createdAt" | "reviewedAt">
  ): Promise<ArtistRequest>;

  approve(requestId: string): Promise<void>;
  reject(requestId: string, reason: string): Promise<void>;
  getPendingRequests(): Promise<ArtistRequest[]>;
  getByUser(userId: string): Promise<ArtistRequest[]>;

  getArtistRequests(page: number, limit: number): Promise<any>;
}
