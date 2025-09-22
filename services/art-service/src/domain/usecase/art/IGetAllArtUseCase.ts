export interface IGetAllArtUseCase {
    execute(page: number, limit: number): Promise<any>
}