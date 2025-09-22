import { Channel } from "amqplib";
import { WalletRepositoryImpl } from "../../repositories/WalletRepositoryImpl";

const walletRepo = new WalletRepositoryImpl();

export async function walletConsumer(ch: Channel) {
  const queue = "wallet-service";
  await ch.assertQueue(queue, { durable: true });
  await ch.bindQueue(queue, "global_exchange", "user.created");

  ch.consume(queue, async (msg) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());
      const existingWallet = await walletRepo.getByUserId(payload.id);
      if (!existingWallet) {
        await walletRepo.create({ userId: payload.id, balance: 0 });
      }
      ch.ack(msg);
    } catch {
      ch.nack(msg, false, false);
    }
  });
}
