export interface IDeleteCommentUseCase {
  execute(id: string, userId: string): Promise<void>;
}
