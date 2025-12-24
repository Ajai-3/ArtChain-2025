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
import { IGetStripeSessionUseCase } from "../../application/interface/usecase/stripe/IGetStripeSessionUseCase";
import { IHandleStripeWebhookUseCase } from "../../application/interface/usecase/stripe/IHandleStripeWebhookUseCase";
import { IGetTransactionsUseCase } from "../../application/interface/usecase/transaction/IGetTransactionsUseCase";
import { ICreateStripeCheckoutSessionUseCase } from "../../application/interface/usecase/stripe/ICreateStripeCheckoutSessionUseCase";

import { GetWalletUseCase } from "../../application/usecases/wallet/GetWalletUseCase";
import { GetStripeSessionUseCase } from "../../application/usecases/GetStripeSessionUseCase";
import { HandleStripeWebhookUseCase } from "../../application/usecases/HandleStripeWebhookUseCase";
import { GetTransactionsUseCase } from "../../application/usecases/transaction/GetTransactionsUseCase";
import { IProcessSplitPurchaseUseCase } from "../../application/interface/usecase/transaction/IProcessSplitPurchaseUseCase";
import { ProcessSplitPurchaseUseCase } from "../../application/usecases/transaction/ProcessSplitPurchaseUseCase";
import { IProcessPaymentUseCase } from "../../application/interface/usecase/transaction/IProcessPaymentUseCase";
import { ProcessPaymentUseCase } from "../../application/usecases/transaction/ProcessPaymentUseCase";
import { CreateStripeCheckoutSessionUseCase } from "../../application/usecases/CreateStripeCheckoutSessionUseCase";
import { ILockFundsUseCase } from "../../application/interface/usecase/wallet/ILockFundsUseCase";
import { IUnlockFundsUseCase } from "../../application/interface/usecase/wallet/IUnlockFundsUseCase";
import { LockFundsUseCase } from "../../application/usecases/wallet/LockFundsUseCase";
import { UnlockFundsUseCase } from "../../application/usecases/wallet/UnlockFundsUseCase";
import { ISettleAuctionUseCase } from "../../application/interface/usecase/wallet/ISettleAuctionUseCase";
import { SettleAuctionUseCase } from "../../application/usecases/wallet/SettleAuctionUseCase";
import { IGetRevenueStatsUseCase } from "../../application/interface/usecase/wallet/IGetRevenueStatsUseCase";
import { GetRevenueStatsUseCase } from "../../application/usecases/wallet/GetRevenueStatsUseCase";
import { ILockCommissionFundsUseCase } from "../../application/interface/usecase/transaction/ILockCommissionFundsUseCase";
import { LockCommissionFundsUseCase } from "../../application/usecases/transaction/LockCommissionFundsUseCase";
import { IDistributeCommissionFundsUseCase } from "../../application/interface/usecase/transaction/IDistributeCommissionFundsUseCase";
import { DistributeCommissionFundsUseCase } from "../../application/usecases/transaction/DistributeCommissionFundsUseCase";
import { IRefundCommissionFundsUseCase } from "../../application/interface/usecase/transaction/IRefundCommissionFundsUseCase";
import { RefundCommissionFundsUseCase } from "../../application/usecases/transaction/RefundCommissionFundsUseCase";

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

// Withdrawal Repository
import { IWithdrawalRepository } from "../../domain/repository/IWithdrawalRepository";
import { WithdrawalRepositoryImpl } from "../repositories/WithdrawalRepositoryImpl";
container
  .bind<IWithdrawalRepository>(TYPES.IWithdrawalRepository)
  .to(WithdrawalRepositoryImpl)
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
  .bind<IProcessSplitPurchaseUseCase>(TYPES.IProcessSplitPurchaseUseCase)
  .to(ProcessSplitPurchaseUseCase);
container
  .bind<IProcessPaymentUseCase>(TYPES.IProcessPaymentUseCase)
  .to(ProcessPaymentUseCase);
container
  .bind<ILockFundsUseCase>(TYPES.ILockFundsUseCase)
  .to(LockFundsUseCase);
container
  .bind<IUnlockFundsUseCase>(TYPES.IUnlockFundsUseCase)
  .to(UnlockFundsUseCase);
container
  .bind<ISettleAuctionUseCase>(TYPES.ISettleAuctionUseCase)
  .to(SettleAuctionUseCase);
container
  .bind<IGetRevenueStatsUseCase>(TYPES.IGetRevenueStatsUseCase)
  .to(GetRevenueStatsUseCase);
container
  .bind<ILockCommissionFundsUseCase>(TYPES.ILockCommissionFundsUseCase)
  .to(LockCommissionFundsUseCase);
container
  .bind<IDistributeCommissionFundsUseCase>(TYPES.IDistributeCommissionFundsUseCase)
  .to(DistributeCommissionFundsUseCase);
container
  .bind<IRefundCommissionFundsUseCase>(TYPES.IRefundCommissionFundsUseCase)
  .to(RefundCommissionFundsUseCase);

import { IGiftArtCoinsUseCase } from "../../application/interface/usecase/wallet/IGiftArtCoinsUseCase";
import { GiftArtCoinsUseCase } from "../../application/usecases/wallet/GiftArtCoinsUseCase";
container
  .bind<IGiftArtCoinsUseCase>(TYPES.IGiftArtCoinsUseCase)
  .to(GiftArtCoinsUseCase);

import { IGetWalletChartDataUseCase } from "../../application/interface/usecase/wallet/IGetWalletChartDataUseCase";
import { GetWalletChartDataUseCase } from "../../application/usecases/wallet/GetWalletChartDataUseCase";
container
  .bind<IGetWalletChartDataUseCase>(TYPES.IGetWalletChartDataUseCase)
  .to(GetWalletChartDataUseCase);

// Withdrawal Use Cases
import { ICreateWithdrawalRequestUseCase } from "../../application/interface/usecase/withdrawal/ICreateWithdrawalRequestUseCase";
import { CreateWithdrawalRequestUseCase } from "../../application/usecases/withdrawal/CreateWithdrawalRequestUseCase";
import { IGetWithdrawalRequestsUseCase } from "../../application/interface/usecase/withdrawal/IGetWithdrawalRequestsUseCase";
import { GetWithdrawalRequestsUseCase } from "../../application/usecases/withdrawal/GetWithdrawalRequestsUseCase";
container
  .bind<ICreateWithdrawalRequestUseCase>(TYPES.ICreateWithdrawalRequestUseCase)
  .to(CreateWithdrawalRequestUseCase);
container
  .bind<IGetWithdrawalRequestsUseCase>(TYPES.IGetWithdrawalRequestsUseCase)
  .to(GetWithdrawalRequestsUseCase);

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

// Withdrawal Controller
import { IWithdrawalController } from "../../presentation/interface/IWithdrawalController";
import { WithdrawalController } from "../../presentation/controllers/WithdrawalController";
container
  .bind<IWithdrawalController>(TYPES.IWithdrawalController)
  .to(WithdrawalController);

// Admin Withdrawal Use Cases
import { IGetAllWithdrawalRequestsUseCase } from "../../application/interface/usecase/withdrawal/IGetAllWithdrawalRequestsUseCase";
import { GetAllWithdrawalRequestsUseCase } from "../../application/usecases/withdrawal/GetAllWithdrawalRequestsUseCase";
import { IUpdateWithdrawalStatusUseCase } from "../../application/interface/usecase/withdrawal/IUpdateWithdrawalStatusUseCase";
import { UpdateWithdrawalStatusUseCase } from "../../application/usecases/withdrawal/UpdateWithdrawalStatusUseCase";
container
  .bind<IGetAllWithdrawalRequestsUseCase>(TYPES.IGetAllWithdrawalRequestsUseCase)
  .to(GetAllWithdrawalRequestsUseCase);
container
  .bind<IUpdateWithdrawalStatusUseCase>(TYPES.IUpdateWithdrawalStatusUseCase)
  .to(UpdateWithdrawalStatusUseCase);

// Admin Withdrawal Controller
import { IAdminWithdrawalController } from "../../presentation/interface/IAdminWithdrawalController";
import { AdminWithdrawalController } from "../../presentation/controllers/AdminWithdrawalController";
container
  .bind<IAdminWithdrawalController>(TYPES.IAdminWithdrawalController)
  .to(AdminWithdrawalController);


// Admin Wallet Management
import { IAdminWalletRepository } from "../../domain/repository/IAdminWalletRepository";
import { AdminWalletRepositoryImpl } from "../repositories/AdminWalletRepositoryImpl";
import { ElasticsearchClient } from "../clients/ElasticsearchClient";
import { UserServiceClient } from "../clients/UserServiceClient";
import { IGetAllWalletsUseCase } from "../../application/interface/usecase/admin/IGetAllWalletsUseCase";
import { GetAllWalletsUseCase } from "../../application/usecases/admin/GetAllWalletsUseCase";

import { IUpdateWalletStatusUseCase } from "../../application/interface/usecase/admin/IUpdateWalletStatusUseCase";
import { UpdateWalletStatusUseCase } from "../../application/usecases/admin/UpdateWalletStatusUseCase";
import { IGetUserTransactionsUseCase } from "../../application/interface/usecase/admin/IGetUserTransactionsUseCase";
import { GetUserTransactionsUseCase } from "../../application/usecases/admin/GetUserTransactionsUseCase";
import { IGetAllRecentTransactionsUseCase } from "../../application/interface/usecase/admin/IGetAllRecentTransactionsUseCase";
import { GetAllRecentTransactionsUseCase } from "../../application/usecases/admin/GetAllRecentTransactionsUseCase";
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
  .bind<IUpdateWalletStatusUseCase>(TYPES.IUpdateWalletStatusUseCase)
  .to(UpdateWalletStatusUseCase);
container
  .bind<IGetUserTransactionsUseCase>(TYPES.IGetUserTransactionsUseCase)
  .to(GetUserTransactionsUseCase);
container
  .bind<IGetAllRecentTransactionsUseCase>(TYPES.IGetAllRecentTransactionsUseCase)
  .to(GetAllRecentTransactionsUseCase);

import { IGetTransactionStatsUseCase } from "../../application/interface/usecase/admin/IGetTransactionStatsUseCase";
import { GetTransactionStatsUseCase } from "../../application/usecases/admin/GetTransactionStatsUseCase";
container
  .bind<IGetTransactionStatsUseCase>(TYPES.IGetTransactionStatsUseCase)
  .to(GetTransactionStatsUseCase);

// Admin Controller
container
  .bind<IAdminWalletController>(TYPES.IAdminWalletController)
  .to(AdminWalletController);




export { container };
