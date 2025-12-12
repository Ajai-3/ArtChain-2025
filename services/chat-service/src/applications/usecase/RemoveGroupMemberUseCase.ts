import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IRemoveGroupMemberUseCase } from "../interface/usecase/IRemoveGroupMemberUseCase";
import { RemoveGroupMemberDto } from "../interface/dto/RemoveGroupMemberDto";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IMessageBroadcastService } from "../../domain/service/IMessageBroadcastService";
import { BadRequestError, NotFoundError, ForbiddenError } from "art-chain-shared";
import { ERROR_MESSAGES } from "../../constants/messages";

@injectable()
export class RemoveGroupMemberUseCase implements IRemoveGroupMemberUseCase {
  constructor(
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(TYPES.IMessageBroadcastService)
    private readonly _broadcastService: IMessageBroadcastService
  ) {}

  async execute(dto: RemoveGroupMemberDto): Promise<boolean> {
    const { conversationId, requesterId, targetUserId } = dto;
    const conversation = await this._conversationRepo.findById(conversationId);

    if (!conversation) {
      throw new NotFoundError(ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    if (conversation.type !== "GROUP") {
      throw new BadRequestError(ERROR_MESSAGES.NOT_A_GROUP_CONVERSATION);
    }

    const isOwner = conversation.ownerId === requesterId;
    const isAdmin = conversation.adminIds.includes(requesterId);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError(ERROR_MESSAGES.ONLY_ADMIN_OWNER_CAN_REMOVE);
    }

    if (targetUserId === conversation.ownerId) {
      throw new ForbiddenError(ERROR_MESSAGES.CANNOT_REMOVE_OWNER);
    }

    if (isAdmin && !isOwner) {
       if (conversation.adminIds.includes(targetUserId)) {
         throw new ForbiddenError(ERROR_MESSAGES.ADMIN_CANNOT_REMOVE_ADMIN);
       }
    }

    const newMemberIds = conversation.memberIds.filter(id => id !== targetUserId);
    const newAdminIds = conversation.adminIds.filter(id => id !== targetUserId);

    await this._conversationRepo.update(conversationId, {
      memberIds: newMemberIds,
      adminIds: newAdminIds
    });

    await this._broadcastService.publishGroupUpdate(conversationId, "MEMBER_REMOVED", {
      userId: targetUserId,
      removedBy: requesterId
    });

    return true;
  }
}
