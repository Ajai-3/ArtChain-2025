import { HttpStatus } from "art-chain-shared";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../infrastructure/inversify/types";
import { IStripeController } from "../interface/IStripeController";
import { IGetStripeSessionUseCase } from "../../application/interface/usecase/IGetStripeSessionUseCase";
import { IHandleStripeWebhookUseCase } from "../../application/interface/usecase/IHandleStripeWebhookUseCase";
import { ICreateStripeCheckoutSessionUseCase } from "../../application/interface/usecase/ICreateStripeCheckoutSessionUseCase";

@injectable()
export class StripeController implements IStripeController {
  constructor(
    @inject(TYPES.ICreateStripeCheckoutSessionUseCase)
    private readonly _createCheckoutUseCase: ICreateStripeCheckoutSessionUseCase,
    @inject(TYPES.IHandleStripeWebhookUseCase)
    private readonly _handleWebhookUseCase: IHandleStripeWebhookUseCase,
    @inject(TYPES.IGetStripeSessionUseCase)
    private readonly _getSessionUseCase: IGetStripeSessionUseCase
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
      console.log(sessionData);
      return res.json(sessionData);
    } catch (error) {
      next(error);
    }
  };
}
