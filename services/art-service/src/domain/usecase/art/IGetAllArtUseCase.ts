export interface IGetAllArtUseCase {
    execute(page: number, limit: number, currentUserId: string): Promise<any>
}