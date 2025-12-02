import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IGetGroupMembersUseCase } from "../interface/usecase/IGetGroupMembersUseCase";
import { GetGroupMembersDto } from "../interface/dto/GetGroupMembersDto";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IUserService } from "../interface/http/IUserService";
import { NotFoundError } from "art-chain-shared";
import { ERROR_MESSAGES } from "../../constants/messages";

@injectable()
export class GetGroupMembersUseCase implements IGetGroupMembersUseCase {
  constructor(
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(TYPES.IUserService)
    private readonly _userService: IUserService
  ) {}

  async execute(dto: GetGroupMembersDto): Promise<any> {
    const { conversationId, page, limit } = dto;
    const conversation = await this._conversationRepo.findById(conversationId);

    if (!conversation) {
      throw new NotFoundError(ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    const allMemberIds = conversation.memberIds;
    const total = allMemberIds.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedIds = allMemberIds.slice(start, end);

    if (paginatedIds.length === 0) {
      return {
        members: [],
        total,
        page,
        limit,
        hasNextPage: false,
      };
    }

    const users = await this._userService.getUsersByIds(paginatedIds);

    const members = users.map((user: any) => ({
      ...user,
      role:
        user.id === conversation.ownerId
          ? "OWNER"
          : conversation.adminIds.includes(user.id)
          ? "ADMIN"
          : "MEMBER",
    }));

    return {
      members,
      total,
      page,
      limit,
      hasNextPage: end < total,
    };
  }
}
