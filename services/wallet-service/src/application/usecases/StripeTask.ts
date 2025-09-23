import Stripe from "stripe";
import { config } from "../../infrastructure/config/env";

export class StripeTask {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripe_secret_key, {
      apiVersion: "2025-08-27.basil",
    });
  }

  async createPaymentIntent(amount: number, currency = "INR") {
    return this.stripe.paymentIntents.create({
      amount, // in paisa
      currency,
    });
  }

  async retrievePaymentIntent(paymentIntentId: string) {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }
}
