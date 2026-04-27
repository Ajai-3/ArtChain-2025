import { Conversation } from '../domain/entities/Conversation';
import { UserDto } from '../applications/interface/dto/MessageResponseDto';

export type ConversationData = Conversation;

export type UserData = UserDto;

export type ConversationArray = Conversation[];

export type UserDataArray = UserData[];

export interface DbMessageQuery {
  conversationId: string;
  _id?: { $lt: string };
}

export interface SignalData {
  to: string;
  signal: unknown;
}

export interface GroupUpdateData {
  conversationId?: string;
  memberIds?: string[];
  name?: string;
  profileImage?: string;
  ownerId?: string;
  adminIds?: string[];
  locked?: boolean;
  userId?: string;
  addedBy?: string;
  removedBy?: string;
}

export interface MongoDbObject {
  _id?: unknown;
  [key: string]: unknown;
}

export interface DomainMapper<T> {
  (dbObj: unknown): T;
}