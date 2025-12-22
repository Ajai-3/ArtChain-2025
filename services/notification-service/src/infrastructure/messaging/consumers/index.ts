import { startEmailConsumer } from "./email/email.consumer";
import { startEmailDLQConsumer } from "./email/email.dlq.consumer";
import { startLikeConsumer } from "./like/likeConsumer";
import { startSupportConsumer } from "./support/supportConsumer";
import { startWalletConsumer } from "./wallet/WalletConsumer";

import { getRabbitChannel } from "../rabbitmq";
import { setupNotificationQueues } from "../queueSetup";

export async function startAllConsumers() {
  const channel = await getRabbitChannel();
  await setupNotificationQueues(channel);

  await Promise.all([
    startEmailConsumer(),
    startEmailDLQConsumer(),
    startLikeConsumer(),
    startSupportConsumer(),
    startWalletConsumer(),
  ]);
}
