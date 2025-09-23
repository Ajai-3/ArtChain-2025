import { Request, Response, NextFunction } from "express";
import { StripeTask } from "../../application/usecases/StripeTask";
import { HttpStatus } from "art-chain-shared";
import { config } from "../../infrastructure/config/env";
import Stripe from "stripe";
import { IStripeController } from "../interface/IStripeController";
const stripe = new Stripe(config.stripe_secret_key, {
  apiVersion: "2025-08-27.basil",
});

export class StripeController implements IStripeController {
  private stripeTask: StripeTask;

  constructor() {
    this.stripeTask = new StripeTask();
  }

  //# ================================================================================================================
  //# CREATE CHECKOUT SESSION
  //# ================================================================================================================
  //# POST /api/v1/wallet/stripe/create-checkout-session
  //# Request Body: { amount: number }
  //# This controller helps to creates a Stripe checkout session for adding funds to wallet.
  //# ================================================================================================================
  createCheckoutSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      console.log(userId);
      const { amount } = req.body;
      if (!amount)
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Amount is required" });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "INR",
              product_data: { name: "ArtCoin Topup" },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${config.client_url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.client_url}/wallet`,
        client_reference_id: userId,
      });

      return res.status(HttpStatus.CREATED).json({ sessionId: session.id });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# HANDLE STRIPE WEBHOOK
  //# ================================================================================================================
  //# POST /api/v1/wallet/stripe/webhook
  //# This controller handles Stripe webhook events such as checkout.session.completed.
  //# ================================================================================================================
  handleWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const sig = req.headers["stripe-signature"]!;

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          config.stripe_webhook_secret
        );
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return res.sendStatus(HttpStatus.BAD_REQUEST);
      }
      console.log(event);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const amountPaid = session.amount_total! / 100;

        // ✅ Save payment info in DB
        console.log("Payment successful!", { userId, amountPaid });

        // Example DB logic (pseudo):
        // await db.wallet.updateBalance(userId, amountPaid);
        // await db.payment.create({ userId, amount: amountPaid, stripeSessionId: session.id });
      }

      res.sendStatus(HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET PAYMENT SESSION
  //# ================================================================================================================
  //# GET /api/v1/wallet/stripe/session/:id
  //# Request Params: id
  //# This controller helps to dispay the curent payment completed status.
  //# ================================================================================================================
  getSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.params.id);

      return res.json({
        sessionId: session.id,
        currency: session.currency,
        userId: session.client_reference_id,
        paymentMethod: session.payment_method_types?.[0],
        paymentStatus: session.payment_status,
        amountPaid: Number((session.amount_total! / 100).toFixed(2)),
        paymentId: session.payment_intent,
        created: session.created,
        customerEmail: session.customer_details?.email,
      });
    } catch (error) {
      next(error)
    }
  };
}
