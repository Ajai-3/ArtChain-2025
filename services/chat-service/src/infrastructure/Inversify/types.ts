export const TYPES = {
  // Repositories
  IMessageRepository: Symbol.for("IMessageRepository"),
  IConversationRepository: Symbol.for("IConversationRepository"),

  // Services
  IUserService: Symbol.for("IUserService"),
  ICacheService: Symbol.for("ICacheService"),
  IMessageCacheService: Symbol.for("IMessageCacheService"),
  IMessageBroadcastService: Symbol.for("IMessageBroadcastService"),

  // Use Cases
  ISendMessageUseCase: Symbol.for("ISendMessageUseCase"),
  IListMessagesUseCase: Symbol.for("IListMessagesUseCase"),
  IDeleteMessageUseCase: Symbol.for("IDeleteMessageUseCase"),
  ICreatePrivateConversationUseCase: Symbol.for("ICreatePrivateConversationUseCase"),

  // Handlers
  IClientEventHandler: Symbol.for("IClientEventHandler"),

  // Controllers
  IMessageController: Symbol.for("IMessageController"),
};
