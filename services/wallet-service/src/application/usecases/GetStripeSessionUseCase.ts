import Stripe from "stripe";
import { config } from "../../infrastructure/config/env";
import { IGetStripeSessionUseCase } from "../../domain/usecase/IGetStripeSessionUseCase";
import { StripeSessionDTO } from "../../domain/dto/StripeSessionDTO";

export class GetStripeSessionUseCase implements IGetStripeSessionUseCase {
  constructor(private readonly _stripe: Stripe) {}

  async execute(sessionId: string): Promise<StripeSessionDTO> {
    if (!sessionId) throw new Error("Missing session ID");

    const session = await this._stripe.checkout.sessions.retrieve(sessionId);

    return {
      sessionId: session.id,
      currency: session.currency || "INR",
      userId: session.client_reference_id ?? "",
      paymentMethod: session.payment_method_types?.[0] ?? undefined,
      paymentStatus: session.payment_status ?? undefined,
      amountPaid: Number((session.amount_total! / 100).toFixed(2)),
      paymentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : undefined,
      created: session.created ?? undefined,
      customerEmail: session.customer_details?.email ?? undefined,
    };
  }
}
