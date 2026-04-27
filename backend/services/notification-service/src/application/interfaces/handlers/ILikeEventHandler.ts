import { LikeEventPayload } from '../../../types';

export interface ILikeEventHandler {
  handle(event: LikeEventPayload): Promise<void>;
}
