import { emitToUser } from "../../infrastructure/sockets/socketHandler";
import { NotificationRepositoryImp } from "../../infrastructure/repositories/NotificationRepositoryImp";
import { logger } from "../../infrastructure/utils/logger";

const repo = new NotificationRepositoryImp();

export async function handleSupportEvent(event: {
  supportedUserId: string;
  supporterId: string;
  supporterName: string;
  supporterProfile: string | null;
  createdAt: string;
}) {
  const notification = {
    userId: event.supportedUserId,
    type: "support",
    data: {
      supporterId: event.supporterId,
      supporterName: event.supporterName,
      supporterProfile: event.supporterProfile,
    },
    read: false,
    createdAt: new Date(event.createdAt),
  };

  const savedNotification = await repo.save(notification);

  logger.info(`✅ Notification saved: ${JSON.stringify(savedNotification)}`);

  await emitToUser(event.supportedUserId, "notification", savedNotification);
}
