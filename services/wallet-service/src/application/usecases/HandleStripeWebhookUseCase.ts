import Stripe from "stripe";
import { IHandleStripeWebhookUseCase } from "../../domain/usecase/IHandleStripeWebhookUseCase";
import { config } from "../../infrastructure/config/env";

export class HandleStripeWebhookUseCase implements IHandleStripeWebhookUseCase {
  constructor(private readonly _stripe: Stripe) {}

  async execute(payload: Buffer, signature: string): Promise<void> {
    if (!signature) throw new Error("Missing Stripe signature");

    let event: Stripe.Event;

    try {
      event = this._stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe_webhook_secret
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      throw new Error("Invalid webhook signature");
    }

    // Handle specific event types
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const amountPaid = session.amount_total! / 100;

      // ✅ Business logic: Save payment info to DB
      console.log("Payment successful!", { userId, amountPaid });

      // Example DB logic (pseudo):
      // await db.wallet.updateBalance(userId, amountPaid);
      // await db.transaction.create({
      //   walletId: userWalletId,
      //   type: "credited",
      //   amount: amountPaid,
      //   method: "stripe",
      //   status: "success",
      //   externalId: session.id,
      //   description: "Wallet topup via Stripe",
      // });
    }
  }
}
