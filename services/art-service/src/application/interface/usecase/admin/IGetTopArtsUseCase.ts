import { ArtPost } from "../../../../domain/entities/ArtPost";

export interface IGetTopArtsUseCase {
  execute(limit: number, type: 'likes' | 'price'): Promise<ArtPost[]>;
}
