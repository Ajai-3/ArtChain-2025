export interface ISocketService {
  initialize(server: any): void;
  publishBid(bid: any): void;
  publishAuctionUpdate(auction: any): void;
  publishAuctionEnded(data: any): void;
}
