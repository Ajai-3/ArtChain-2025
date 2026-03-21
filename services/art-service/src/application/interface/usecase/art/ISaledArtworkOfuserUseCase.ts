export interface ISaledArtworkOfuserUseCase {
    execute(userId: string, page: number, limit: number): Promise<any>  ;
}