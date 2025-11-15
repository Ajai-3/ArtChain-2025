export const TYPES = {

  // Repositories
  IMessageRepository: Symbol.for("IMessageRepository"),
  IConversationRepository: Symbol.for("IConversationRepository"),

  // Use Cases
  ISendMessageUseCase: Symbol.for("ISendMessageUseCase"),
  IListMessagesUseCase: Symbol.for("IListMessagesUseCase"),
  IDeleteMessageUseCase: Symbol.for("IDeleteMessageUseCase"),

  // Services
  IMessageService: Symbol.for("IMessageService"),

  // Controllers
  IMessageController: Symbol.for("IMessageController"),
};