export const TYPES = {
  // Repositories
  IWalletRepository: Symbol.for("IWalletRepository"),
  ITransactionRepository: Symbol.for("ITransactionRepository"),

  StripeClient: Symbol.for("StripeClient"),

  // Use Cases
  IGetWalletUseCase: Symbol.for("IGetWalletUseCase"),
  IGetTransactionsUseCase: Symbol.for("IGetTransactionsUseCase"),
  IGetStripeSessionUseCase: Symbol.for("IGetStripeSessionUseCase"),
  IHandleStripeWebhookUseCase: Symbol.for("IHandleStripeWebhookUseCase"),
  ICreateStripeCheckoutSessionUseCase: Symbol.for(
    "ICreateStripeCheckoutSessionUseCase"
  ),
  IProcessPurchaseUseCase: Symbol.for("IProcessPurchaseUseCase"),
  ILockFundsUseCase: Symbol.for("ILockFundsUseCase"),
  IUnlockFundsUseCase: Symbol.for("IUnlockFundsUseCase"),

  // Controller
  IStripeController: Symbol.for("IStripeController"),
  IWalletController: Symbol.for("IWalletController"),
  ITransactionController: Symbol.for("ITransactionController"),
  IAdminWalletController: Symbol.for("IAdminWalletController"),

  // Admin Wallet
  IAdminWalletRepository: Symbol.for("IAdminWalletRepository"),
  ElasticsearchClient: Symbol.for("ElasticsearchClient"),
  UserServiceClient: Symbol.for("UserServiceClient"),
  IGetAllWalletsUseCase: Symbol.for("IGetAllWalletsUseCase"),
  ISearchWalletsUseCase: Symbol.for("ISearchWalletsUseCase"),
  IUpdateWalletStatusUseCase: Symbol.for("IUpdateWalletStatusUseCase"),
  IGetUserTransactionsUseCase: Symbol.for("IGetUserTransactionsUseCase"),
};
