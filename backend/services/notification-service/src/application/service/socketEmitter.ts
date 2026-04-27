import { SocketPayload } from '../../types';

export interface ISocketEmitter {
  emitToUser(userId: string, event: string, payload: SocketPayload): Promise<void>;
}