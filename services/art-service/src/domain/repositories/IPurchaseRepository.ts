import { Purchase } from "../entities/Purchase";

export interface IPurchaseRepository {
  create(purchase: Purchase): Promise<Purchase>;
  findByUserAndArt(userId: string, artId: string): Promise<Purchase | null>;
  findByArtId(artId: string): Promise<Purchase | null>;
}
