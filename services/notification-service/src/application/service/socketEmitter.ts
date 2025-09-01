export interface ISocketEmitter {
  emitToUser(userId: string, event: string, payload: any): Promise<void>;
}