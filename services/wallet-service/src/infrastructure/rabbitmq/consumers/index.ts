import { Channel } from "amqplib";
import { walletConsumer } from "./walletConsumer";


const consumers = [walletConsumer];

export async function startAllConsumers(ch: Channel) {
  for (const consumer of consumers) {
    await consumer(ch);
  }
}
