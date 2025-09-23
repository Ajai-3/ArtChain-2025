// src/application/controllers/StripeController.ts
import { Request, Response, NextFunction } from "express";
import { StripeTask } from "../../application/usecases/StripeTask";
import { HttpStatus } from "art-chain-shared";
import { config } from "../../infrastructure/config/env";
import Stripe from "stripe";
const stripe = new Stripe(config.stripe_secret_key, {
  apiVersion: "2025-08-27.basil",
});

export class StripeController {
  private stripeTask: StripeTask;

  constructor() {
    this.stripeTask = new StripeTask();
  }

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
        return res.status(400).json({ message: "Amount is required" });

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

      return res.status(201).json({ sessionId: session.id });
    } catch (err) {
      next(err);
    }
  };

   handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const sig = req.headers["stripe-signature"]!;
      console.log(sig)
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          config.stripe_webhook_secret
        );
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return res.sendStatus(400);
      }
      console.log(event)

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

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };


getSession = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);

    // Fetch line items
    const lineItems = await stripe.checkout.sessions.listLineItems(req.params.id, {
      limit: 100,
    });

    return res.json({
      sessionId: session.id,
      amountPaid: session.amount_total! / 100,
      currency: session.currency,
      userId: session.client_reference_id,
      paymentMethod: session.payment_method_types?.[0],
      paymentStatus: session.payment_status,
      created: session.created,
      customerEmail: session.customer_details?.email,
      lineItems: lineItems.data.map(item => ({
        name: item.description,
        quantity: item.quantity,
        amount: item.amount_total! / 100,
      })),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

}
