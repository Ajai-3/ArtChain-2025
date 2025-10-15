export interface IGetCommentsUseCase {
  execute(postId: string, page: number, limit: number): Promise<any[]>;
}
