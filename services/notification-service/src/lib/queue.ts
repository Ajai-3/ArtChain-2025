import { Channel } from "amqplib";

export async function setupQueueWithDLQ(ch: Channel, queue: string) {
  const dlqName = `${queue}.dlq`;

  await ch.assertQueue(dlqName, { durable: true });
  await ch.assertQueue(queue, {
    durable: true,
    deadLetterExchange: "",
    deadLetterRoutingKey: dlqName,
  });

  console.log(`📩 Queue ready: ${queue}`);
  console.log(`☠️ DLQ ready: ${dlqName}`);

  return { dlqName };
}
