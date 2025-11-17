import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IUserService } from "../interface/http/IUserService";
import { ConversationType } from "../../domain/entities/Conversation";
import { mapConversation, mapConversations } from "../mappers/mapConversations";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IGetAllResendConversationUseCase } from "../interface/usecase/IGetAllResendConversationUseCase";

@injectable()
export class GetAllResendConversationUseCase
  implements IGetAllResendConversationUseCase
{
  constructor(
    @inject(TYPES.IUserService)
    private readonly _userService: IUserService,
    @inject(TYPES.IMessageRepository)
    private readonly _messagesRepo: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository
  ) {}

  async execute(userId: string, page: number, limit: number) {
    const { conversations, total } =
      await this._conversationRepo.listResentByUser(userId, page, limit);

    if (conversations.length === 0) {
      return {
        conversations: [],
        page,
        limit,
        nextPage: null,
        hasNextPage: false,
        total: 0,
      };
    }

    const convIds = conversations.map((c) => c.id);

    const [lastMessages, unreadCounts] = await Promise.all([
      this._messagesRepo.getLastMessages(convIds),
      this._messagesRepo.getUnreadCounts(convIds, userId),
    ]);

    const lastMap = new Map(lastMessages.map((m) => [m.conversationId, m]));
    const unreadMap = new Map(
      unreadCounts.map((u) => [u.conversationId, u.count])
    );

    const partnerIds = new Set<string>();
    for (const c of conversations) {
      if (
        c.type === ConversationType.PRIVATE ||
        c.type === ConversationType.REQUEST
      ) {
        const pid = c.memberIds.find((id) => id !== userId);
        if (pid) partnerIds.add(pid);
      }
    }

    const partnerList =
      partnerIds.size > 0
        ? await this._userService.getUsersByIds([...partnerIds])
        : [];
    const partnersMap = new Map(partnerList.map((u) => [u.id, u]));

    const enriched = mapConversations(
      conversations,
      userId,
      lastMap,
      unreadMap,
      partnersMap
    );

    const conversationsWithMessages = enriched.filter(
      (conv) => conv.lastMessage !== null
    );

    conversationsWithMessages.sort((a, b) => {
      const timeA = a.lastMessage?.createdAt
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const timeB = b.lastMessage?.createdAt
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;
      return timeB - timeA;
    });

    return {
      conversations: conversationsWithMessages,
      page,
      limit,
      nextPage: page * limit < total ? page + 1 : null,
      hasNextPage: page * limit < total,
      total: conversationsWithMessages.length,
    };
  }
}
