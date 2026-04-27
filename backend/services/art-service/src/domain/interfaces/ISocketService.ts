import type { Server as HttpServer } from 'http';
import type {
  SocketAuctionEndedPayload,
  SocketAuctionUpdatePayload,
  SocketBidPayload,
} from '../../types/socket';

export interface ISocketService {
  initialize(server: HttpServer): void;
  publishBid(bid: SocketBidPayload): void;
  publishAuctionUpdate(auction: SocketAuctionUpdatePayload): void;
  publishAuctionEnded(data: SocketAuctionEndedPayload): void;
}
