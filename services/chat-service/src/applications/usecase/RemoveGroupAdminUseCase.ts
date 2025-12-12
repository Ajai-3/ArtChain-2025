import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IRemoveGroupAdminUseCase } from "../interface/usecase/IRemoveGroupAdminUseCase";
import { AddGroupAdminDto } from "../interface/dto/AddGroupAdminDto"; // Reusing DTO as it has same fields
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IMessageBroadcastService } from "../../domain/service/IMessageBroadcastService";
import { BadRequestError, NotFoundError, ForbiddenError } from "art-chain-shared";
import { ERROR_MESSAGES } from "../../constants/messages";

@injectable()
export class RemoveGroupAdminUseCase implements IRemoveGroupAdminUseCase {
  constructor(
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(TYPES.IMessageBroadcastService)
    private readonly _broadcastService: IMessageBroadcastService
  ) {}

  async execute(dto: AddGroupAdminDto): Promise<boolean> {
    const { conversationId, requesterId, targetUserId } = dto;
    const conversation = await this._conversationRepo.findById(conversationId);

    if (!conversation) {
      throw new NotFoundError(ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    if (conversation.type !== "GROUP") {
      throw new BadRequestError(ERROR_MESSAGES.NOT_A_GROUP_CONVERSATION);
    }

    if (conversation.ownerId !== requesterId) {
      throw new ForbiddenError(ERROR_MESSAGES.ONLY_OWNER_CAN_REMOVE_ADMIN);
    }

    if (!conversation.adminIds.includes(targetUserId)) {
      return true; // Not an admin, nothing to do
    }

    const newAdminIds = conversation.adminIds.filter(id => id !== targetUserId);

    await this._conversationRepo.update(conversationId, {
      adminIds: newAdminIds
    });

    await this._broadcastService.publishGroupUpdate(conversationId, "ADMIN_REMOVED", {
      userId: targetUserId,
      removedBy: requesterId
    });

    return true;
  }
}
