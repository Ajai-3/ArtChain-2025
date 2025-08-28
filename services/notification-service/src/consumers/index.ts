import { startEmailConsumer } from "./email/email.consumer";
import { startEmailDLQConsumer } from "./email/email.dlq.consumer";


export async function startAllConsumers() {
  await Promise.all([startEmailConsumer(), startEmailDLQConsumer()]);
}
