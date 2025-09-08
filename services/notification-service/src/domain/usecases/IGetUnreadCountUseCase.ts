export interface IGetUnreadCountUseCase {
    execute(userid: string): Promise<number>
}