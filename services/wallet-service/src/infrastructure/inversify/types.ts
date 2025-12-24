export const TYPES = {
  // Repositories
  IWalletRepository: Symbol.for("IWalletRepository"),
  ITransactionRepository: Symbol.for("ITransactionRepository"),
  IWithdrawalRepository: Symbol.for("IWithdrawalRepository"),

  StripeClient: Symbol.for("StripeClient"),

  // Use Cases
  IGetWalletUseCase: Symbol.for("IGetWalletUseCase"),
  IGetTransactionsUseCase: Symbol.for("IGetTransactionsUseCase"),
  IGetStripeSessionUseCase: Symbol.for("IGetStripeSessionUseCase"),
  IHandleStripeWebhookUseCase: Symbol.for("IHandleStripeWebhookUseCase"),
  ICreateStripeCheckoutSessionUseCase: Symbol.for(
    "ICreateStripeCheckoutSessionUseCase"
  ),

  IProcessSplitPurchaseUseCase: Symbol.for("IProcessSplitPurchaseUseCase"),
  IProcessPaymentUseCase: Symbol.for("IProcessPaymentUseCase"),
  ILockFundsUseCase: Symbol.for("ILockFundsUseCase"),
  IUnlockFundsUseCase: Symbol.for("IUnlockFundsUseCase"),
  ISettleAuctionUseCase: Symbol.for("ISettleAuctionUseCase"),
  IGetRevenueStatsUseCase: Symbol.for("IGetRevenueStatsUseCase"),
  ICreateWithdrawalRequestUseCase: Symbol.for("ICreateWithdrawalRequestUseCase"),
  IGetWithdrawalRequestsUseCase: Symbol.for("IGetWithdrawalRequestsUseCase"),
  IGetAllWithdrawalRequestsUseCase: Symbol.for("IGetAllWithdrawalRequestsUseCase"),
  IUpdateWithdrawalStatusUseCase: Symbol.for("IUpdateWithdrawalStatusUseCase"),
  IGetWalletChartDataUseCase: Symbol.for("IGetWalletChartDataUseCase"),
  ILockCommissionFundsUseCase: Symbol.for("ILockCommissionFundsUseCase"),
  IDistributeCommissionFundsUseCase: Symbol.for("IDistributeCommissionFundsUseCase"),
  IRefundCommissionFundsUseCase: Symbol.for("IRefundCommissionFundsUseCase"),
  IGiftArtCoinsUseCase: Symbol.for("IGiftArtCoinsUseCase"),

  // Controller
  IStripeController: Symbol.for("IStripeController"),
  IWalletController: Symbol.for("IWalletController"),
  ITransactionController: Symbol.for("ITransactionController"),
  IAdminWalletController: Symbol.for("IAdminWalletController"),
  IWithdrawalController: Symbol.for("IWithdrawalController"),
  IAdminWithdrawalController: Symbol.for("IAdminWithdrawalController"),

  // Admin Wallet
  IAdminWalletRepository: Symbol.for("IAdminWalletRepository"),
  ElasticsearchClient: Symbol.for("ElasticsearchClient"),
  UserServiceClient: Symbol.for("UserServiceClient"),
  IGetAllWalletsUseCase: Symbol.for("IGetAllWalletsUseCase"),
  ISearchWalletsUseCase: Symbol.for("ISearchWalletsUseCase"),
  IUpdateWalletStatusUseCase: Symbol.for("IUpdateWalletStatusUseCase"),
  IGetUserTransactionsUseCase: Symbol.for("IGetUserTransactionsUseCase"),
  IGetAllRecentTransactionsUseCase: Symbol.for("IGetAllRecentTransactionsUseCase"),
  IGetTransactionStatsUseCase: Symbol.for("IGetTransactionStatsUseCase"),
};
