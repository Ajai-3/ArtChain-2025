import Stripe from "stripe";
import { StripeController } from "../../presentation/controllers/StripeController";
import { GetStripeSessionUseCase } from "../../application/usecases/GetStripeSessionUseCase";
import { HandleStripeWebhookUseCase } from "../../application/usecases/HandleStripeWebhookUseCase";
import { CreateStripeCheckoutSessionUseCase } from "./../../application/usecases/CreateStripeCheckoutSessionUseCase";
import { config } from "../config/env";
import { WalletRepositoryImpl } from "../repositories/WalletRepositoryImpl";
import { TransactionRepositoryImpl } from "../repositories/TransactionRepositoryImpl";

// Repositories
const stripeInstance = new Stripe(config.stripe_secret_key, {
  apiVersion: "2025-08-27.basil",
});
const walletRepo = new WalletRepositoryImpl();
const transactionRepo = new TransactionRepositoryImpl();

// Use Cases
const getStripeSessionUseCase = new GetStripeSessionUseCase(stripeInstance);
const handleStripeWebhookUseCase = new HandleStripeWebhookUseCase(
  stripeInstance,
  walletRepo,
  transactionRepo
);
const createStripeCheckoutSessionUseCase =
  new CreateStripeCheckoutSessionUseCase(stripeInstance);

// Controller
export const stripeController = new StripeController(
  createStripeCheckoutSessionUseCase,
  handleStripeWebhookUseCase,
  getStripeSessionUseCase
);
