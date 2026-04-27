import { injectable } from 'inversify';
import { Server } from 'socket.io';
import { ISocketService } from '../../domain/interfaces/ISocketService';
import { redisPub, redisSub } from '../config/redis';
import { logger } from '../../utils/logger';
import { registerAuctionEvents } from '../socket/auctionHandler';
import { authMiddleware } from '../../presentation/middleware/authMiddleware';
import type { Server as HttpServer } from 'http';
import type {
  SocketAuctionEndedPayload,
  SocketAuctionUpdatePayload,
  SocketBidPayload,
} from '../../types/socket';

@injectable()
export class SocketService implements ISocketService {
    private io: Server | undefined;

    initialize(server: HttpServer): void {
        this.io = new Server(server, {
            path: '/socket.io/bidding',
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        this.io.use(authMiddleware);

        this.io.on('connection', (socket) => {
            registerAuctionEvents(this.io!, socket);
        });

        if (redisSub) {
            redisSub.subscribe('bid_placed', 'auction_updated', (err) => {
                if (err) console.error('❌ [SocketService] Redis Subscribe Error:', err);
            });

            redisSub.on('message', (channel, message) => {
                if (!this.io) return;
                try {
                    const data = JSON.parse(message);

                    if (channel === 'bid_placed') {
                        // Broadcast globally as requested so all clients (list view etc) can update
                        this.io.emit('bid_placed', data);
                    } else if (channel === 'auction_updated') {
                        this.io.emit('auction_updated', data);
                    }
                } catch (e) {
                    console.error('❌ [SocketService] Error parsing redis message', e);
                }
            });
        }
    }

    publishBid(bid: SocketBidPayload): void {
        // Broadcast locally immediately
        if (this.io) {
            this.io.emit('bid_placed', bid);
        }
        // Publish to Redis for other instances
        if (redisPub) redisPub.publish('bid_placed', JSON.stringify(bid));
    }

    publishAuctionUpdate(auction: SocketAuctionUpdatePayload): void {
        if (this.io) {
            this.io.emit('auction_updated', auction);
        }
        if (redisPub) redisPub.publish('auction_updated', JSON.stringify(auction));
    }

    publishAuctionEnded(data: SocketAuctionEndedPayload): void {
        if (this.io) {
            this.io.emit('auction_ended', data);
        }
        // Assuming we want to sync this across instances too
        if (redisPub) redisPub.publish('auction_ended', JSON.stringify(data));
    }
}
