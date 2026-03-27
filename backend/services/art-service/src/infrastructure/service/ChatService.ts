import axios from 'axios';
import { injectable } from 'inversify';
import { config } from '../config/env';
import { IChatService } from '../../domain/interfaces/IChatService';

@injectable()
export class ChatService implements IChatService {
  async createRequestConversation(
    userId: string,
    artistId: string,
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}/api/v1/chat/conversation/request`,
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
    } catch (error: any) {
      console.error(
        'ChatService: Error detail:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to create conversation for commission');
    }
  }
}
