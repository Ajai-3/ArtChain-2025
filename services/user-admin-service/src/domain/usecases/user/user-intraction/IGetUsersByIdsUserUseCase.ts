import { ArtUser } from "../../../../types/ArtUser";

export interface IGetUsersByIdsUserUseCase {
    execute(ids: string[]): Promise<ArtUser[]>
}