export interface ILikeEventHandler {
  handle(event: any): Promise<void>;
}
