import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";
import { config } from "../../infrastructure/config/env";
import { IStripeController } from "../interface/IStripeController";
import { CreateStripeCheckoutSessionUseCase } from "../../application/usecases/CreateStripeCheckoutSessionUseCase";
import { HandleStripeWebhookUseCase } from "../../application/usecases/HandleStripeWebhookUseCase";
import { GetStripeSessionUseCase } from "../../application/usecases/GetStripeSessionUseCase";

export class StripeController implements IStripeController {
  constructor(
    private readonly _createCheckoutUseCase: CreateStripeCheckoutSessionUseCase,
    private readonly _handleWebhookUseCase: HandleStripeWebhookUseCase,
    private readonly _getSessionUseCase: GetStripeSessionUseCase
  ) {}

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

      const { amount } = req.body;
      const session = await this._createCheckoutUseCase.execute(userId, amount);

      return res.status(HttpStatus.CREATED).json({
        message: "Checkout session created",
        sessionId: session.id,
      });
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
      const payload = req.body as Buffer;
      const signature = req.headers["stripe-signature"] as string;

      await this._handleWebhookUseCase.execute(payload, signature);

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
      const sessionData = await this._getSessionUseCase.execute(req.params.id);
      console.log(sessionData)
      return res.json(sessionData);
    } catch (error) {
      next(error);
    }
  };
}
