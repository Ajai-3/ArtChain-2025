import "reflect-metadata";
import { TYPES } from "./types";
import { Container } from "inversify";

// Repositories
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { NotificationRepositoryImp } from "../repositories/NotificationRepositoryImp";

// Use Cases
import { IMarkAsReadUseCase } from "../../domain/usecases/IMarkAsReadUseCase";
import { IMarkAsAllReadUseCase } from "../../domain/usecases/IMarkAllAsReadUseCase";
import { IGetUnreadCountUseCase } from "../../domain/usecases/IGetUnreadCountUseCase";
import { IGetUserNotificationsUseCase } from "../../domain/usecases/IGetUserNotificationsUseCase";

import { MarkAsReadUseCase } from "../../application/usecases/MarkAsReadUseCase";
import { MarkAllAsReadUseCase } from "../../application/usecases/MarkAllAsReadUseCase";
import { GetUnreadCountUseCase } from "../../application/usecases/GetUnreadCountUseCase";
import { GetUserNotificationsUseCase } from "../../application/usecases/GetUserNotificationsUseCase";

// Controllers
import { INotificationController } from "../../presentation/interface/INotificationController";

import { NotificationController } from "../../presentation/controllers/NotificationController";

const container = new Container();

// Repositories
container
  .bind<INotificationRepository>(TYPES.INotificationRepository)
  .to(NotificationRepositoryImp)
  .inSingletonScope();

// Use Cases
container
  .bind<IMarkAsReadUseCase>(TYPES.IMarkAsReadUseCase)
  .to(MarkAsReadUseCase);
container
  .bind<IMarkAsAllReadUseCase>(TYPES.IMarkAsAllReadUseCase)
  .to(MarkAllAsReadUseCase);
container
  .bind<IGetUnreadCountUseCase>(TYPES.IGetUnreadCountUseCase)
  .to(GetUnreadCountUseCase);
container
  .bind<IGetUserNotificationsUseCase>(TYPES.IGetUserNotificationsUseCase)
  .to(GetUserNotificationsUseCase);

// Clients
import { IUserServiceClient } from "../../application/interfaces/clients/IUserServiceClient";
import { UserServiceClient } from "../clients/UserServiceClient";
container
  .bind<IUserServiceClient>(TYPES.IUserServiceClient)
  .to(UserServiceClient)
  .inSingletonScope();

// Handlers
import { IGiftEventHandler } from "../../application/interfaces/handlers/IGiftEventHandler";
import { GiftEventHandler } from "../../application/handlers/GiftEventHandler";
container
  .bind<IGiftEventHandler>(TYPES.IGiftEventHandler)
  .to(GiftEventHandler);

import { ILikeEventHandler } from "../../application/interfaces/handlers/ILikeEventHandler";
import { LikeEventHandler } from "../../application/handlers/LikeEventHandler";
container
  .bind<ILikeEventHandler>(TYPES.ILikeEventHandler)
  .to(LikeEventHandler);

import { ISupportEventHandler } from "../../application/interfaces/handlers/ISupportEventHandler";
import { SupportEventHandler } from "../../application/handlers/SupportEventHandler";
container
  .bind<ISupportEventHandler>(TYPES.ISupportEventHandler)
  .to(SupportEventHandler);

// Controllers
container
  .bind<INotificationController>(TYPES.INotificationController)
  .to(NotificationController);

export { container };
