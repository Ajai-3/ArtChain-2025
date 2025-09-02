import { startEmailConsumer } from "./email/email.consumer";
import { startEmailDLQConsumer } from "./email/email.dlq.consumer";
import { startSupportConsumer } from "./support/supportConsumer";

export async function startAllConsumers() {
  await Promise.all([
    startEmailConsumer(),
    startEmailDLQConsumer(),
    startSupportConsumer(),
  ]);
}
