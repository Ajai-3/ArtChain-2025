export interface IAdminDeleteCommentUseCase {
  execute(id: string): Promise<void>;
}
