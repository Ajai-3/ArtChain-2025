import { GiftEventPayload } from '../../../types';

export interface IGiftEventHandler {
  handle(event: GiftEventPayload): Promise<void>;
}
