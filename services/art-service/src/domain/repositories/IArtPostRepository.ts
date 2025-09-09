import { ArtPost } from "../../domain/entities/ArtPost";
import { IBaseRepository } from "./IBaseRepository";

export interface IArtPostRepository extends IBaseRepository<ArtPost> {
  getAllByUser(userId: string, page?: number, limit?: number): Promise<ArtPost[]>;
}
