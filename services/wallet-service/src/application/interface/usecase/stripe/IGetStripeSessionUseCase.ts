import { StripeSessionDTO } from "../../dto/StripeSessionDTO";

export interface IGetStripeSessionUseCase {
  execute(sessionId: string): Promise<StripeSessionDTO>;
}
