export interface IMarkAsAllReadUseCase {
    execute(userId: string): Promise<void>
}