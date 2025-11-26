import { inject, injectable } from "inversify";
import { IMarkMessagesReadUseCase } from "../interface/usecase/IMarkMessagesReadUseCase";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";

@injectable()
export class MarkMessagesReadUseCase implements IMarkMessagesReadUseCase {
  constructor(
    @inject(TYPES.IMessageRepository)
    private readonly _messageRepository: IMessageRepository
  ) {}

  async execute(messageIds: string[], userId: string, conversationId: string): Promise<void> {
    if (!messageIds.length) return;
    await this._messageRepository.markRead(messageIds, userId);
  }
}
