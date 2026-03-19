import { Purchase } from '../entities/Purchase';

export interface IPurchaseRepository {
  create(purchase: Purchase): Promise<Purchase>;
  findByArtId(artId: string): Promise<Purchase | null>;
  findByUserAndArt(userId: string, artId: string): Promise<Purchase | null>;
  findByUserId(userId: string, page: number, limit: number): Promise<Purchase[]>;
}
