import { ConversationType } from "../../domain/entities/Conversation";
import { Message } from "../../domain/entities/Message";
import { UserDto } from "../interface/dto/MessageResponseDto";

export interface EnrichedGroup {
  name?: string;
  profileImage?: string | null;
}

export interface EnrichedConversation {
  id: string;
  type: ConversationType;
  name?: string;
  ownerId?: string;
  memberIds: string[];
  adminIds: string[];
  locked: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  lastMessage: Message | null;
  unreadCount: number;

  partner: Omit<UserDto, "status"> | null;
  group: EnrichedGroup | null;
}

interface MapConversationParams {
  conversation: any;
  userId: string;
  lastMap: Map<string, Message>;
  unreadMap: Map<string, number>;
  partnersMap: Map<string, UserDto>;
}

export function mapConversation({
  conversation: c,
  userId,
  lastMap,
  unreadMap,
  partnersMap,
}: MapConversationParams): EnrichedConversation {
  const pid = c.memberIds.find((id: string) => id !== userId);

  let partner: Omit<UserDto, "status"> | null = null;
  if (
    (c.type === ConversationType.PRIVATE ||
      c.type === ConversationType.REQUEST) &&
    pid
  ) {
    const p = partnersMap.get(pid);
    if (p) {
      const { status, ...rest } = p;
      partner = rest;
    }
  }

  const group: EnrichedGroup | null =
    c.type === ConversationType.GROUP
      ? { name: c.name, profileImage: c.profileImage ?? null }
      : null;

  let lastMessage = lastMap.get(c.id) || null;

  if (lastMessage) {
    if (lastMessage.deleteMode === "ALL") {
      lastMessage = {
        ...lastMessage,
        content: "",
      };
    } else if (
      lastMessage.deleteMode === "ME" &&
      lastMessage.senderId === userId
    ) {
      lastMessage = {
        ...lastMessage,
        content: "",
      };
    }
  }

  return {
    id: c.id,
    type: c.type,
    name: c.name,
    ownerId: c.ownerId,
    memberIds: c.memberIds,
    adminIds: c.adminIds,
    locked: c.locked,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,

    lastMessage,
    unreadCount: unreadMap.get(c.id) || 0,
    partner,
    group,
  };
}

export function mapConversations(
  conversations: any[],
  userId: string,
  lastMap: Map<string, Message>,
  unreadMap: Map<string, number>,
  partnersMap: Map<string, UserDto>
): EnrichedConversation[] {
  return conversations.map((c) =>
    mapConversation({
      conversation: c,
      userId,
      lastMap,
      unreadMap,
      partnersMap,
    })
  );
}
