import Stripe from "stripe";
import { IHandleStripeWebhookUseCase } from "../../domain/usecase/IHandleStripeWebhookUseCase";
import { config } from "../../infrastructure/config/env";
import { IWalletRepository } from "../../domain/repository/IWalletRepository";
import { ITransactionRepository } from "../../domain/repository/ITransactionRepository";
import {
  Method,
  TransactionStatus,
  TransactionType,
} from "../../domain/entities/Transaction";
import { BadRequestError, ConflictError } from "art-chain-shared";
import { WALLET_MESSAGES } from "../../constants/WalletMessages";
import { logger } from "../../utils/logger";

export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
  private readonly ART_COIN_RATE = 0.1;

  constructor(
    private readonly _stripe: Stripe,
    private readonly _walletRepo: IWalletRepository,
    private readonly _transactionRepo: ITransactionRepository
  ) {}

  async execute(payload: Buffer, signature: string): Promise<void> {
    if (!signature) throw new BadRequestError(WALLET_MESSAGES.STRIPE_SGNATURE_MISSING);

    let event: Stripe.Event;
    try {
      event = this._stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe_webhook_secret
      );
    } catch (err: any) {
      logger.error("Invalid webhook signature:", err.message);
      throw new BadRequestError(WALLET_MESSAGES.INVALID_WEBHOOK_SIGNATURE);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.handleCheckoutSessionCompleted(session);
    } else {
      logger.info(`Ignoring Stripe event: ${event.type}`);
    }
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ) {
    const userId = session.client_reference_id;
    if (!userId) throw new BadRequestError(WALLET_MESSAGES.USER_ID_MISSING);

    const externalId = session.id;

    const existingTransaction = await this._transactionRepo.findByExternalId(
      externalId
    );
    if (existingTransaction) {
      logger.info(
        `Transaction already exists for session: ${externalId}, skipping`
      );
      throw new ConflictError(WALLET_MESSAGES.TRANSACTION_ALREADY_EXIST)
    }

    const amountInINR = (session.amount_total ?? 0) / 100;
    const amountInArtCoins = amountInINR * this.ART_COIN_RATE;

    let wallet = await this._walletRepo.getByUserId(userId);
    if (!wallet) {
      wallet = await this._walletRepo.create({
        userId,
        balance: 0,
        status: "active",
      });
    }

    await this._transactionRepo.create({
      walletId: wallet.id,
      type: "credited" as TransactionType,
      amount: amountInArtCoins,
      method: "stripe" as Method,
      status: "success" as TransactionStatus,
      externalId,
      description: "Wallet top-up via Stripe (Art Coins)",
      meta: session,
    });

    await this._walletRepo.update(
      { id: wallet.id },
      { balance: wallet.balance + amountInArtCoins }
    );

    logger.info(
      `Wallet updated for user: ${userId}, added ${amountInArtCoins} Art Coins`
    );
  }
}
