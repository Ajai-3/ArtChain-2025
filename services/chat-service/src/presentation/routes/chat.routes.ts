import express from 'express';
import { TYPES } from '../../infrastructure/Inversify/types';
import { IMessageController } from '../interface/IMessageController';
import container from '../../infrastructure/Inversify/Inversify.config';
import { IConversationController } from '../interface/IConversationController';
import { ROUTES } from '../../constants/routes';

const router = express.Router();

const messageController = container.get<IMessageController>(TYPES.IMessageController);
const conversationController = container.get<IConversationController>(TYPES.IConversationController);

// Routes
router.post(
  ROUTES.CHAT.CONVERSATION_PRIVATE,
  conversationController.createPrivateConversation
);
router.post(
  ROUTES.CHAT.CONVERSATION_GROUP,
  conversationController.createGroupConversation
);
router.get(
  ROUTES.CHAT.CONVERSATION_RECENT,
  conversationController.getResendConversations
);
router.post(ROUTES.CHAT.MESSAGE_SEND, messageController.sendMessage);
router.get(ROUTES.CHAT.MESSAGE_BY_CONVERSATION_ID, messageController.listMessages);
router.delete(ROUTES.CHAT.MESSAGE_BY_MESSAGE_ID, messageController.deleteMessage);

export default router;