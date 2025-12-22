import { Message } from "../../../domain/entities/Message";

export interface IUpdateCallMessageUseCase {
  execute(callId: string, updates: Partial<Message>): Promise<Message | null>;
}
