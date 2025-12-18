export const TYPES = {
  // Repositories
  INotificationRepository: Symbol.for("INotificationRepository"),

  // Use Cases
  IMarkAsReadUseCase: Symbol.for("IMarkAsReadUseCase"),
  IMarkAsAllReadUseCase: Symbol.for("IMarkAsAllReadUseCase"),
  IGetUnreadCountUseCase: Symbol.for("IGetUnreadCountUseCase"),
  IGetUserNotificationsUseCase: Symbol.for("IGetUserNotificationsUseCase"),

  // Clients
  IUserServiceClient: Symbol.for("IUserServiceClient"),

  // Handlers
  IGiftEventHandler: Symbol.for("IGiftEventHandler"),
  ILikeEventHandler: Symbol.for("ILikeEventHandler"),
  ISupportEventHandler: Symbol.for("ISupportEventHandler"),

  // Controllers
  INotificationController: Symbol.for("INotificationController"),
};
