import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IAddGroupAdminUseCase } from "../interface/usecase/IAddGroupAdminUseCase";
import { AddGroupAdminDto } from "../interface/dto/AddGroupAdminDto";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IMessageBroadcastService } from "../../domain/service/IMessageBroadcastService";
import { BadRequestError, NotFoundError, ForbiddenError } from "art-chain-shared";
import { ERROR_MESSAGES } from "../../constants/messages";

@injectable()
export class AddGroupAdminUseCase implements IAddGroupAdminUseCase {
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
      throw new ForbiddenError(ERROR_MESSAGES.ONLY_OWNER_CAN_ADD_ADMIN);
    }

    if (!conversation.memberIds.includes(targetUserId)) {
      throw new BadRequestError(ERROR_MESSAGES.USER_NOT_MEMBER);
    }

    if (conversation.adminIds.includes(targetUserId)) {
      return true; // Already admin
    }

    const newAdminIds = [...conversation.adminIds, targetUserId];

    await this._conversationRepo.update(conversationId, {
      adminIds: newAdminIds
    });

    await this._broadcastService.publishGroupUpdate(conversationId, "ADMIN_ADDED", {
      userId: targetUserId,
      addedBy: requesterId
    });

    return true;
  }
}
