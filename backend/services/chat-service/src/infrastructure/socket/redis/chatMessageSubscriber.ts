import { Server } from 'socket.io';
import { redisSub } from '../../config/redis';
import { TYPES } from '../../Inversify/types';
import container from '../../Inversify/Inversify.config';
import { IConversationCacheService } from '../../../applications/interface/service/IConversationCacheService';
import { logger } from '../../utils/logger';

const conversationCacheService = container.get<IConversationCacheService>(
  TYPES.IConversationCacheService
);

export const subscribeChatMessages = (
  io: Server,
  onlineUsers: Map<string, string>
) => {
  redisSub.subscribe('chat_messages');
  logger.info('Subscribed to Redis channel: chat_messages');

  redisSub.on('message', async (channel, message) => {
    if (channel !== 'chat_messages') return;

    const data = JSON.parse(message);

    // Handle new private conversation
    if (data.type === 'new_private_conversation') {
      const recipientId = data.recipientId;
      const socketId = onlineUsers.get(recipientId);
      
      if (socketId) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          socket.emit('newPrivateConversation', data.conversation);
          logger.info(`Emitted newPrivateConversation to user: ${recipientId}`);
        }
      } else {
        logger.info(`Recipient ${recipientId} is offline, will see conversation on next login`);
      }
      return;
    }

    // Handle new group conversation
    if (data.type === 'new_group_conversation') {
      const memberIds = data.memberIds;
      logger.info('Notifying group members:', memberIds);

      memberIds.forEach((userId: string) => {
        const socketId = onlineUsers.get(userId);
        if (socketId) {
          const socket = io.sockets.sockets.get(socketId);
          if (socket) {
            socket.emit('newGroupConversation', data.conversation);
            logger.info(`Emitted newGroupConversation to user: ${userId}`);
          }
        } else {
          logger.info(`Member ${userId} is offline, will see conversation on next login`);
        }
      });
      return;
    }

    // Handle message-related events (existing logic)
    const memberIds = await conversationCacheService.getConversationMembers(
      data.conversationId
    );
    logger.info(`Conversation members for ${data.type}:`, memberIds);

    memberIds.forEach((userId) => {
      const socketId = onlineUsers.get(userId); 
      if (!socketId) {
        logger.warn(`Socket not found for user: ${userId}`);
        return;
      }

      const socket = io.sockets.sockets.get(socketId); 
      if (!socket) {
        logger.warn(`Socket instance not found for userId: ${userId}`);
        return;
      }


      if (data.type === 'new_message') {
        socket.emit('newMessage', data.message, data.tempId);
        logger.info(`Emitted newMessage to user: ${userId}`);
      } else if (data.type === 'delete_message') {
        // For "ME" mode, only emit to the user who deleted it
        if (data.deleteMode === 'ME' && userId !== data.userId) {
          return; // Skip this user
        }
        
        socket.emit('messageDeleted', { 
          conversationId: data.conversationId,
          messageId: data.messageId,
          deleteMode: data.deleteMode
        });
        logger.info(`Emitted messageDeleted to user: ${userId}`);
      }
    });
  });
};