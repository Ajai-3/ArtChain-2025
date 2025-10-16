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

  // Controller
  IStripeController: Symbol.for("IStripeController"),
  IWalletController: Symbol.for("IWalletController"),
  ITransactionController: Symbol.for("ITransactionController")
};
