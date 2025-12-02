import { Server } from "socket.io";
import { redisSub } from "../../config/redis";
import { TYPES } from "../../Inversify/types";
import container from "../../Inversify/Inversify.config";
import { IConversationCacheService } from "../../../applications/interface/service/IConversationCacheService";

const conversationCacheService = container.get<IConversationCacheService>(
  TYPES.IConversationCacheService
);

export const subscribeChatMessages = (
  io: Server,
  onlineUsers: Map<string, string>
) => {
  redisSub.subscribe("chat_messages");
  console.log("Subscribed to Redis channel: chat_messages");

  redisSub.on("message", async (channel, message) => {
    console.log("Redis message received:", { channel, message });
    if (channel !== "chat_messages") return;

    const data = JSON.parse(message);
    console.log("Parsed message data:", data);

    // Handle new private conversation
    if (data.type === "new_private_conversation") {
      const recipientId = data.recipientId;
      const socketId = onlineUsers.get(recipientId);
      
      if (socketId) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          socket.emit("newPrivateConversation", data.conversation);
          console.log(`Emitted newPrivateConversation to user: ${recipientId}`);
        }
      } else {
        console.log(`Recipient ${recipientId} is offline, will see conversation on next login`);
      }
      return;
    }

    // Handle new group conversation
    if (data.type === "new_group_conversation") {
      const memberIds = data.memberIds;
      console.log(`Notifying group members:`, memberIds);

      memberIds.forEach((userId: string) => {
        const socketId = onlineUsers.get(userId);
        if (socketId) {
          const socket = io.sockets.sockets.get(socketId);
          if (socket) {
            socket.emit("newGroupConversation", data.conversation);
            console.log(`Emitted newGroupConversation to user: ${userId}`);
          }
        } else {
          console.log(`Member ${userId} is offline, will see conversation on next login`);
        }
      });
      return;
    }

    // Handle message-related events (existing logic)
    const memberIds = await conversationCacheService.getConversationMembers(
      data.conversationId
    );
    console.log(`Conversation members for ${data.type}:`, memberIds);

    memberIds.forEach((userId) => {
      const socketId = onlineUsers.get(userId); 
      if (!socketId) {
        console.log(`Socket not found for user: ${userId}`);
        return;
      }

      const socket = io.sockets.sockets.get(socketId); 
      if (!socket) {
        console.log(`Socket instance not found for userId: ${userId}`);
        return;
      }


      if (data.type === "new_message") {
        socket.emit("newMessage", data.message, data.tempId);
        console.log(`Emitted newMessage to user: ${userId}`);
      } else if (data.type === "delete_message") {
        // For "ME" mode, only emit to the user who deleted it
        if (data.deleteMode === "ME" && userId !== data.userId) {
          return; // Skip this user
        }
        
        socket.emit("messageDeleted", { 
          conversationId: data.conversationId,
          messageId: data.messageId,
          deleteMode: data.deleteMode
        });
        console.log(`Emitted messageDeleted to user: ${userId}`);
      }
    });
  });
};
