import { ArtPost } from "../../domain/entities/ArtPost";
import { IBaseRepository } from "./IBaseRepository";

export interface IArtPostRepository extends IBaseRepository<ArtPost> {
  getAllArt(page: number, limit: number): Promise<any>
  findByArtName(artName: string): Promise<any>
  countByUser(userId: string): Promise<number>
  getAllByUser(userId: string, page?: number, limit?: number): Promise<ArtPost[]>;
}
