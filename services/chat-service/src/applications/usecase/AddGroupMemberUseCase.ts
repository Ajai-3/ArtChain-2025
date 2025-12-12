import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IAddGroupMemberUseCase } from "../interface/usecase/IAddGroupMemberUseCase";
import { AddGroupAdminDto } from "../interface/dto/AddGroupAdminDto";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IMessageBroadcastService } from "../../domain/service/IMessageBroadcastService";
import { BadRequestError, NotFoundError, ForbiddenError } from "art-chain-shared";
import { ERROR_MESSAGES } from "../../constants/messages";

@injectable()
export class AddGroupMemberUseCase implements IAddGroupMemberUseCase {
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

    const isOwner = conversation.ownerId === requesterId;
    const isAdmin = conversation.adminIds.includes(requesterId);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError(ERROR_MESSAGES.ONLY_ADMIN_CAN_ADD_MEMBER);
    }

    if (conversation.memberIds.includes(targetUserId)) {
      return true; // Already a member
    }

    const newMemberIds = [...conversation.memberIds, targetUserId];

    await this._conversationRepo.update(conversationId, {
      memberIds: newMemberIds
    });

    await this._broadcastService.publishGroupUpdate(conversationId, "MEMBER_ADDED", {
      userId: targetUserId,
      addedBy: requesterId
    });

    return true;
  }
}
