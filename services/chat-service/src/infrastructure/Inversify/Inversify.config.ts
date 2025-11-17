import { TYPES } from "./types";
import { Container } from "inversify";

// Repositories
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";

import { MessageRepositoryImp } from "../repositories/MessageRepositoryImp";
import { ConversationRepositoryImp } from "../repositories/ConversationRepositoryImp";

// Use-Case
import { ISendMessageUseCase } from "../../applications/interface/usecase/ISendMessageUseCase";
import { IListMessagesUseCase } from "../../applications/interface/usecase/IListMessagesUseCase";
import { IDeleteMessageUseCase } from "../../applications/interface/usecase/IDeleteMessageUseCase";
import { ICreatePrivateConversationUseCase } from "../../applications/interface/usecase/ICreatePrivateConversationUseCase";

import { SendMessageUseCase } from "../../applications/usecase/SendMessageUseCase";
import { ListMessagesUseCase } from "../../applications/usecase/ListMessagesUseCase";
import { DeleteMessageUseCase } from "../../applications/usecase/DeleteMessageUseCase";
import { CreatePrivateConversationUseCase } from "../../applications/usecase/CreatePrivateConversationUseCase";

// Services
import { UserService } from "../http/UserService";
import { RedisCacheService } from "../cache/RedisCacheService";
import { MessageCacheService } from "../services/MessageCacheService";
import { MessageBroadcastService } from "../services/MessageBroadcastService";

import { ICacheService } from "../../domain/service/ICacheService";
import { IUserService } from "../../applications/interface/http/IUserService";
import { IMessageBroadcastService } from "../../domain/service/IMessageBroadcastService";
import { IMessageCacheService } from "../../applications/interface/service/IMessageCacheService";

// Handlers
import { IClientEventHandler } from "../socket/interface/IClientEventHandler";

import { ClientEventHandler } from "../socket/handlers/ClientEventHandler";

// Controller
import { IMessageController } from "../../presentation/interface/IMessageController";
import { IConversationController } from "../../presentation/interface/IConversationController";

import { MessageController } from "../../presentation/controllers/MessageController";
import { ConversationController } from "../../presentation/controllers/ConversationController";

const container = new Container();

// Repositories
container
  .bind<IMessageRepository>(TYPES.IMessageRepository)
  .to(MessageRepositoryImp)
  .inSingletonScope();
container
  .bind<IConversationRepository>(TYPES.IConversationRepository)
  .to(ConversationRepositoryImp)
  .inSingletonScope();

// Use-Case
container
  .bind<ISendMessageUseCase>(TYPES.ISendMessageUseCase)
  .to(SendMessageUseCase);
container
  .bind<IListMessagesUseCase>(TYPES.IListMessagesUseCase)
  .to(ListMessagesUseCase);
container
  .bind<IDeleteMessageUseCase>(TYPES.IDeleteMessageUseCase)
  .to(DeleteMessageUseCase);
container
  .bind<ICreatePrivateConversationUseCase>(
    TYPES.ICreatePrivateConversationUseCase
  )
  .to(CreatePrivateConversationUseCase);

// Srevice
container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind<ICacheService>(TYPES.ICacheService).to(RedisCacheService);
container
  .bind<IMessageBroadcastService>(TYPES.IMessageBroadcastService)
  .to(MessageBroadcastService);
container
  .bind<IMessageCacheService>(TYPES.IMessageCacheService)
  .to(MessageCacheService);

// Handlers
container
  .bind<IClientEventHandler>(TYPES.IClientEventHandler)
  .to(ClientEventHandler);

// Controller
container
  .bind<IMessageController>(TYPES.IMessageController)
  .to(MessageController);
container
  .bind<IConversationController>(TYPES.IConversationController)
  .to(ConversationController);

export default container;
