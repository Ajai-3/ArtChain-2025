import express from 'express';
import { TYPES } from '../../infrastructure/Inversify/types';
import { IMessageController } from '../interface/IMessageController';
import container from '../../infrastructure/Inversify/Inversify.config';

const router = express.Router();

const messageController = container.get<IMessageController>(TYPES.IMessageController);

// Routes
router.post('/message/send', messageController.sendMessage);
router.get('/message/:conversationId', messageController.listMessages);
router.delete('/message/:messageId', messageController.deleteMessage);



export default router;