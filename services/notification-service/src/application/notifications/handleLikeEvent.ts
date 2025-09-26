import { Notification } from "../../domain/entities/Notification";
import { emitToUser } from "../../infrastructure/sockets/socketHandler";
import { NotificationRepositoryImp } from "../../infrastructure/repositories/NotificationRepositoryImp";
import { logger } from "../../infrastructure/utils/logger";

const repo = new NotificationRepositoryImp();

export async function handleLikeEvent(event: {
  likedUserId: string;
  likerId: string;
  likerName: string;
  likerProfile: string | null;
  createdAt: string;
}) {
  const notification = new Notification(
    event.likedUserId,
    "like",        
    {
      likerId: event.likerId,
      likerName: event.likerName,
      likerProfile: event.likerProfile,
    },
    false,              
    new Date(event.createdAt)
  );

  const savedNotification = await repo.save(notification);

  logger.info(`✅ Like Notification saved: ${JSON.stringify(savedNotification)}`);

  await emitToUser(event.likedUserId, "notification", savedNotification);
}
