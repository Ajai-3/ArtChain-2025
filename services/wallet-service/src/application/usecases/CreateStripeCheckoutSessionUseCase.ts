import Stripe from "stripe";
import { config } from "../../infrastructure/config/env";
import { ICreateStripeCheckoutSessionUseCase } from "../../domain/usecase/ICreateStripeCheckoutSessionUseCase";

export class CreateStripeCheckoutSessionUseCase
  implements ICreateStripeCheckoutSessionUseCase
{
  constructor(private readonly _stripe: Stripe) {}

  async execute(
    userId: string,
    amount: number
  ): Promise<Stripe.Checkout.Session> {
    if (!userId) throw new Error("Missing user ID");
    if (!amount || amount <= 0) throw new Error("Invalid amount");

    const session = await this._stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: "ArtCoin Topup",
              description: `${amount} INR → ${amount / 10} ArtCoins`,
              metadata: { userId },
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      client_reference_id: userId,
      success_url: `${config.client_url}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.client_url}/wallet`,
      metadata: { userId, amount },
    });

    return session;
  }
}
