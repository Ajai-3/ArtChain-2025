import Stripe from "stripe";

export interface ICreateStripeCheckoutSessionUseCase {
  execute(userId: string, amount: number): Promise<Stripe.Checkout.Session>;
}