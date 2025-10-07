export interface IArtService {
    getUserArtCount(userId: string): Promise<number>
}