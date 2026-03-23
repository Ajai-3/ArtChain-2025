export interface IDeleteUserArtPostUseCase {
    execute(id: string, userId: string): Promise<void>;
}