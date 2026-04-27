import { Socket } from 'socket.io';
import { TYPES } from '../../Inversify/types';
import { inject, injectable, unmanaged } from 'inversify';
import { IClientEventHandler } from '../interface/IClientEventHandler';
import { SendMessageDto } from '../../../applications/interface/dto/SendMessageDto';
import { DeleteMessageDto } from '../../../applications/interface/dto/DeleteMessageDto';
import { ISendMessageUseCase } from '../../../applications/interface/usecase/ISendMessageUseCase';
import { IDeleteMessageUseCase } from '../../../applications/interface/usecase/IDeleteMessageUseCase';
import { IMarkMessagesReadUseCase } from '../../../applications/interface/usecase/IMarkMessagesReadUseCase';
import { logger } from '../../utils/logger';

@injectable()
export class ClientEventHandler implements IClientEventHandler {
  constructor(
    @unmanaged() private onlineUsers: Map<string, string>,
    @inject(TYPES.ISendMessageUseCase)
    private readonly _sendMessageUseCase: ISendMessageUseCase,
    @inject(TYPES.IDeleteMessageUseCase)
    private readonly _deleteMessageUseCase: IDeleteMessageUseCase,
    @inject(TYPES.IMarkMessagesReadUseCase)
    private readonly _markMessagesReadUseCase: IMarkMessagesReadUseCase
  ) {}

  typing = (socket: Socket, data: { conversationId: string }) => {
    const userId = socket.data.userId;
    logger.info(`User ${userId} typing in conversation ${data.conversationId}`);
    socket.to(data.conversationId).emit('userTyping', { 
      userId, 
      conversationId: data.conversationId 
    });
  };

  sendMessage = async (
    socket: Socket,
    payload: SendMessageDto,
    callback?: (ack: boolean) => void
  ) => {
    const userId = socket.data.userId;

    try {
      const dto: SendMessageDto = {
        ...payload,
        senderId: userId,
      };

      logger.info('Sending message DTO:', dto);

      await this._sendMessageUseCase.execute(dto);
      if (callback) callback(true);
    } catch (err) {
      logger.error('Send message error:', err);
      if (callback) callback(false);
    }
  };

  deleteMessage = async (
    socket: Socket,
    payload: {
      conversationId: string;
      messageId: string;
      mode: 'ME' | 'EVERYONE';
    },
    callback?: (ack: boolean) => void
  ) => {
    const userId = socket.data.userId;

    try {
      const dto: DeleteMessageDto = {
        messageId: payload.messageId,
        userId,
        mode: payload.mode,
      };

      await this._deleteMessageUseCase.execute(dto);
      if (callback) callback(true);
    } catch (err) {
      logger.error('Delete message error:', err);
      if (callback) callback(false);
    }
  };

  convoOpened = async (
    socket: Socket,
    payload: { conversationId: string; time: Date }
  ) => {
    const userId = socket.data.userId;
    const conversationId = payload.conversationId;
    
    logger.info(`User ${userId} opened conversation ${conversationId}`);
    socket.join(conversationId);

    try {
        // Mark all messages as read when conversation is opened
        await this._markMessagesReadUseCase.execute([], userId, conversationId);
    } catch (error) {
        logger.error('Error marking messages read on open:', error);
    }

    socket.to(conversationId).emit('userJoined', { userId });
  };

  markMessagesRead = async (
    socket: Socket,
    payload: { conversationId: string; messageIds: string[] }
  ) => {
    const userId = socket.data.userId;
    logger.info(`Received markMessagesRead event from user ${userId} for conversation ${payload.conversationId}, messages: ${payload.messageIds.length}`);
    try {
      await this._markMessagesReadUseCase.execute(
        payload.messageIds,
        userId,
        payload.conversationId
      );

      socket.to(payload.conversationId).emit('messagesRead', {
        conversationId: payload.conversationId,
        messageIds: payload.messageIds,
        readBy: userId,
      });
    } catch (err) {
      logger.error('Mark messages read error:', err);
    }
  };
}
