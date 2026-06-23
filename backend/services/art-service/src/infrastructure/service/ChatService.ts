import axios from 'axios';
import { injectable } from 'inversify';
import { config } from '../config/env';
import { IChatService } from '../../domain/interfaces/IChatService';
import { SERVICE_MESSAGES, SERVICE_ROUTES } from '../../constants/ServiceMessages';

@injectable()
export class ChatService implements IChatService {
  async createRequestConversation(
    userId: string,
    artistId: string,
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}${SERVICE_ROUTES.CHAT_SEND}`,
        { artistId },
        {
          headers: {
            'x-user-id': userId,
          },
        },
      );

      if (
        response.data &&
        response.data.data &&
        response.data.data.conversation
      ) {
        const convId =
          response.data.data.conversation.id ||
          response.data.data.conversation._id;
        return convId;
      }

      throw new Error('Invalid response from Chat Service');
    } catch (error) {
      throw new Error(SERVICE_MESSAGES.CHAT_SEND_ERROR);
    }
  }
}
