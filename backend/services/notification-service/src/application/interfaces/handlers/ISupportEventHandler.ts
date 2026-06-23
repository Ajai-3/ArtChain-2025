import { SupportEventPayload } from '../../../types';

export interface ISupportEventHandler {
  handle(event: SupportEventPayload): Promise<void>;
}
