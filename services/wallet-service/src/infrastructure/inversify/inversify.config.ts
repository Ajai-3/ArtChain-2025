import { IStripeController } from "./../../presentation/interface/IStripeController";
import "reflect-metadata";
import Stripe from "stripe";
import { TYPES } from "./types";
import { Container } from "inversify";
import { config } from "../../infrastructure/config/env";

// Repositories
import { WalletRepositoryImpl } from "../repositories/WalletRepositoryImpl";
import { IWalletRepository } from "../../domain/repository/IWalletRepository";
import { TransactionRepositoryImpl } from "../repositories/TransactionRepositoryImpl";
import { ITransactionRepository } from "../../domain/repository/ITransactionRepository";

// Use Cases
import { IGetWalletUseCase } from "../../application/interface/usecase/wallet/IGetWalletUseCase";
import { IGetStripeSessionUseCase } from "../../application/interface/usecase/IGetStripeSessionUseCase";
import { IHandleStripeWebhookUseCase } from "../../application/interface/usecase/IHandleStripeWebhookUseCase";
import { IGetTransactionsUseCase } from "../../application/interface/usecase/transaction/IGetTransactionsUseCase";
import { ICreateStripeCheckoutSessionUseCase } from "../../application/interface/usecase/ICreateStripeCheckoutSessionUseCase";

import { GetWalletUseCase } from "../../application/usecases/wallet/GetWalletUseCase";
import { GetStripeSessionUseCase } from "../../application/usecases/GetStripeSessionUseCase";
import { HandleStripeWebhookUseCase } from "../../application/usecases/HandleStripeWebhookUseCase";
import { GetTransactionsUseCase } from "../../application/usecases/transaction/GetTransactionsUseCase";
import { CreateStripeCheckoutSessionUseCase } from "../../application/usecases/CreateStripeCheckoutSessionUseCase";

// Controllers
import { IWalletController } from "../../presentation/interface/IWalletController";
import { WalletController } from "../../presentation/controllers/WalletController";
import { StripeController } from "../../presentation/controllers/StripeController";
import { ITransactionController } from "../../presentation/interface/ITransactionController";
import { TransactionController } from "../../presentation/controllers/TransactionController";

const container = new Container();

// Repositories
container
  .bind<IWalletRepository>(TYPES.IWalletRepository)
  .to(WalletRepositoryImpl)
  .inSingletonScope();
container
  .bind<ITransactionRepository>(TYPES.ITransactionRepository)
  .to(TransactionRepositoryImpl)
  .inSingletonScope();
container
  .bind<Stripe>(TYPES.StripeClient)
  .toDynamicValue(
    () =>
      new Stripe(config.stripe_secret_key, {
        apiVersion: "2025-08-27.basil",
      })
  )
  .inSingletonScope();

// Use Cases
container.bind<IGetWalletUseCase>(TYPES.IGetWalletUseCase).to(GetWalletUseCase);
container
  .bind<IGetTransactionsUseCase>(TYPES.IGetTransactionsUseCase)
  .to(GetTransactionsUseCase);
container
  .bind<ICreateStripeCheckoutSessionUseCase>(
    TYPES.ICreateStripeCheckoutSessionUseCase
  )
  .to(CreateStripeCheckoutSessionUseCase);
container
  .bind<IHandleStripeWebhookUseCase>(TYPES.IHandleStripeWebhookUseCase)
  .to(HandleStripeWebhookUseCase);
container
  .bind<IGetStripeSessionUseCase>(TYPES.IGetStripeSessionUseCase)
  .to(GetStripeSessionUseCase);

// Controllers
container.bind<IStripeController>(TYPES.IStripeController).to(StripeController);
container.bind<IWalletController>(TYPES.IWalletController).to(WalletController);
container
  .bind<ITransactionController>(TYPES.ITransactionController)
  .to(TransactionController);

// Admin Wallet Management
import { IAdminWalletRepository } from "../../domain/repository/IAdminWalletRepository";
import { AdminWalletRepositoryImpl } from "../repositories/AdminWalletRepositoryImpl";
import { ElasticsearchClient } from "../clients/ElasticsearchClient";
import { UserServiceClient } from "../clients/UserServiceClient";
import { IGetAllWalletsUseCase } from "../../application/interface/usecases/admin/IGetAllWalletsUseCase";
import { GetAllWalletsUseCase } from "../../application/usecases/admin/GetAllWalletsUseCase";
import { ISearchWalletsUseCase } from "../../application/interface/usecases/admin/ISearchWalletsUseCase";
import { SearchWalletsUseCase } from "../../application/usecases/admin/SearchWalletsUseCase";
import { IUpdateWalletStatusUseCase } from "../../application/interface/usecases/admin/IUpdateWalletStatusUseCase";
import { UpdateWalletStatusUseCase } from "../../application/usecases/admin/UpdateWalletStatusUseCase";
import { IGetUserTransactionsUseCase } from "../../application/interface/usecases/admin/IGetUserTransactionsUseCase";
import { GetUserTransactionsUseCase } from "../../application/usecases/admin/GetUserTransactionsUseCase";
import { IAdminWalletController } from "../../presentation/interface/IAdminWalletController";
import { AdminWalletController } from "../../presentation/controllers/AdminWalletController";

// Admin Repositories & Clients
container
  .bind<IAdminWalletRepository>(TYPES.IAdminWalletRepository)
  .to(AdminWalletRepositoryImpl)
  .inSingletonScope();
container
  .bind<ElasticsearchClient>(TYPES.ElasticsearchClient)
  .to(ElasticsearchClient)
  .inSingletonScope();
container
  .bind<UserServiceClient>(TYPES.UserServiceClient)
  .to(UserServiceClient)
  .inSingletonScope();

// Admin Use Cases
container
  .bind<IGetAllWalletsUseCase>(TYPES.IGetAllWalletsUseCase)
  .to(GetAllWalletsUseCase);
container
  .bind<ISearchWalletsUseCase>(TYPES.ISearchWalletsUseCase)
  .to(SearchWalletsUseCase);
container
  .bind<IUpdateWalletStatusUseCase>(TYPES.IUpdateWalletStatusUseCase)
  .to(UpdateWalletStatusUseCase);
container
  .bind<IGetUserTransactionsUseCase>(TYPES.IGetUserTransactionsUseCase)
  .to(GetUserTransactionsUseCase);

// Admin Controller
container
  .bind<IAdminWalletController>(TYPES.IAdminWalletController)
  .to(AdminWalletController);

export { container };
