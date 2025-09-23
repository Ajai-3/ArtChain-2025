import { StripeController } from "../../presentation/controllers/StripeController";
import { GetStripeSessionUseCase } from '../../application/usecases/GetStripeSessionUseCase';
import { HandleStripeWebhookUseCase } from '../../application/usecases/HandleStripeWebhookUseCase';
import { CreateStripeCheckoutSessionUseCase } from './../../application/usecases/CreateStripeCheckoutSessionUseCase';

// Repositories

// Use Cases
const getStripeSessionUseCase = new GetStripeSessionUseCase()
const handleStripeWebhookUseCase = new HandleStripeWebhookUseCase()
const createStripeCheckoutSessionUseCase = new CreateStripeCheckoutSessionUseCase()

// Controller
export const stripeController = new StripeController(createStripeCheckoutSessionUseCase, handleStripeWebhookUseCase, getStripeSessionUseCase)