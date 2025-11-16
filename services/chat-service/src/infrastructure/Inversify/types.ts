export const TYPES = {
  // Repositories
  IMessageRepository: Symbol.for("IMessageRepository"),
  IConversationRepository: Symbol.for("IConversationRepository"),

  // Use Cases
  ISendMessageUseCase: Symbol.for("ISendMessageUseCase"),
  IListMessagesUseCase: Symbol.for("IListMessagesUseCase"),
  IDeleteMessageUseCase: Symbol.for("IDeleteMessageUseCase"),

  // Services
  IUserService: Symbol.for("IUserService"),
  ICacheService: Symbol.for("ICacheService"),
  IMessageCacheService: Symbol.for("IMessageCacheService"),
  IMessageBroadcastService: Symbol.for("IMessageBroadcastService"),

  // Controllers
  IMessageController: Symbol.for("IMessageController"),
};