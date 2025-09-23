import { Request, Response, NextFunction } from "express";

export interface IStripeController {
    createCheckoutSession(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  handleWebhook(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  getSession(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}