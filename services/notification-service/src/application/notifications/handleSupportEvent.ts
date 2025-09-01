import { emitToUser } from "../../infrastructure/sockets/socketHandler"

export async function handleSupportEvent(event: {
  supportedUserId: string;
  supporterId: string;
  supporterName: string;
  supporterProfile: string | null;
  createdAt: string;
}) {
  await emitToUser(event.supportedUserId, "notification", {
    type: "support",
    supporter: {
      id: event.supporterId,
      name: event.supporterName,
      profile: event.supporterProfile,
    },
    createdAt: event.createdAt,
  });

  // optional: persist in DB
}
