import Stripe from "stripe";
import { StripeController } from "../../presentation/controllers/StripeController";
import { GetStripeSessionUseCase } from '../../application/usecases/GetStripeSessionUseCase';
import { HandleStripeWebhookUseCase } from '../../application/usecases/HandleStripeWebhookUseCase';
import { CreateStripeCheckoutSessionUseCase } from './../../application/usecases/CreateStripeCheckoutSessionUseCase';
import { config } from "../config/env";

// Repositories
const stripeInstance = new Stripe(config.stripe_secret_key, {
      apiVersion: "2025-08-27.basil",
    });

// Use Cases
const getStripeSessionUseCase = new GetStripeSessionUseCase(stripeInstance)
const handleStripeWebhookUseCase = new HandleStripeWebhookUseCase(stripeInstance)
const createStripeCheckoutSessionUseCase = new CreateStripeCheckoutSessionUseCase(stripeInstance)

// Controller
export const stripeController = new StripeController(createStripeCheckoutSessionUseCase, handleStripeWebhookUseCase, getStripeSessionUseCase)