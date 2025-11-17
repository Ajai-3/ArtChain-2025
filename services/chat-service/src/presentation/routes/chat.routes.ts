import express from 'express';
import { TYPES } from '../../infrastructure/Inversify/types';
import { IMessageController } from '../interface/IMessageController';
import container from '../../infrastructure/Inversify/Inversify.config';
import { IConversationController } from '../interface/IConversationController';

const router = express.Router();

const messageController = container.get<IMessageController>(TYPES.IMessageController);
const conversationController = container.get<IConversationController>(TYPES.IConversationController);

// Routes
router.post(
  "/conversation/private",
  conversationController.createPrivateConversation
);
router.get(
  "/conversation/recent",
  conversationController.getResendConversations
);
router.post('/message/send', messageController.sendMessage);
router.get('/message/:conversationId', messageController.listMessages);
router.delete('/message/:messageId', messageController.deleteMessage);



export default router;