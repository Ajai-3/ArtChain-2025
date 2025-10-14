export const TYPES = {
  // Repositories
  INotificationRepository: Symbol.for("INotificationRepository"),

  // Use Cases
  IMarkAsReadUseCase: Symbol.for("IMarkAsReadUseCase"),
  IMarkAsAllReadUseCase: Symbol.for("IMarkAsAllReadUseCase"),
  IGetUnreadCountUseCase: Symbol.for("IGetUnreadCountUseCase"),
  IGetUserNotificationsUseCase: Symbol.for("IGetUserNotificationsUseCase"),

  // Controllers
  INotificationController: Symbol.for("INotificationController"),
};
