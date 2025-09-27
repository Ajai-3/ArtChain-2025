export interface IGetArtByNameUseCase {
    execute(artName: string, currentUserId: string): Promise<any>
}