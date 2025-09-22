import { ArtPost } from "../../entities/ArtPost";

export interface IGetArtByIdUseCase {
    execute(id: string): Promise<ArtPost | null>
}