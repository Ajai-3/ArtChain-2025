import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { Message } from "../../domain/entities/Message";
import { IUpdateCallMessageUseCase } from "../interface/usecase/IUpdateCallMessageUseCase";
import { IMessageBroadcastService } from "../../domain/service/IMessageBroadcastService";

@injectable()
export class UpdateCallMessageUseCase implements IUpdateCallMessageUseCase {
  constructor(
    @inject(TYPES.IMessageRepository) private _repository: IMessageRepository,
    @inject(TYPES.IMessageBroadcastService) private _broadcastService: IMessageBroadcastService
  ) {}

  async execute(callId: string, updates: Partial<Message>): Promise<Message | null> {
    const updatedMessage = await this._repository.updateByCallId(callId, updates);
    
    if (updatedMessage) {
        await this._broadcastService.publishMessage(updatedMessage);
    }
    
    return updatedMessage;
  }
}
