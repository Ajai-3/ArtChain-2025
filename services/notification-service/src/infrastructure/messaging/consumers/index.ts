import { startEmailConsumer } from "./email/email.consumer";
import { startEmailDLQConsumer } from "./email/email.dlq.consumer";
import { startLikeConsumer } from "./like/likeConsumer";
import { startSupportConsumer } from "./support/supportConsumer";
import { startWalletConsumer } from "./wallet/WalletConsumer";

export async function startAllConsumers() {
  await Promise.all([
    startEmailConsumer(),
    startEmailDLQConsumer(),
    startLikeConsumer(),
    startSupportConsumer(),
    startWalletConsumer(),
  ]);
}
