import amqp from "amqplib";
import { config } from "../../config/env";
import { TYPES } from "../../inversify/types";
import type { Channel, Connection } from "amqplib";
import { container } from "../../inversify/inversify.config";
import { IUpdateProfileUserUseCase } from "../../../application/interface/usecases/user/profile/IUpdateProfileUserUseCase";

const QUEUE = "profile_update";

export async function initProfileUpdateConsumer() {
  const conn: Connection = await amqp.connect(config.rabbitmq_URL) as any;
  const ch: Channel = await conn.createChannel();

  console.log(`👂 Listening on queue: ${QUEUE}`);

  const updateProfileUseCase = container.get<IUpdateProfileUserUseCase>(
    TYPES.IUpdateProfileUserUseCase
  );

  ch.consume(
    QUEUE,
    async (msg) => {
      if (!msg) return;

      try {
        const { payload } = JSON.parse(msg.content.toString());
        const { userId, category, key } = payload;

        console.log(
          `📥 Received profile update for user: ${userId}, category: ${category}, url: ${key}`
        );

        switch (category) {
          case "profile":
            await updateProfileUseCase.execute({ userId, profileImage: key });
            break;
          case "banner":
            await updateProfileUseCase.execute({ userId, bannerImage: key });
            break;
          case "background":
            await updateProfileUseCase.execute({
              userId,
              backgroundImage: key,
            });
            break;
          default:
            console.warn("⚠️ Unknown category:", category);
        }

        ch.ack(msg);
        console.log("✅ User profile updated successfully");
      } catch (err) {
        console.error("❌ Failed to process profile update:", err);
        ch.nack(msg, false, false); 
      }
    },
    { noAck: false }
  );
}
