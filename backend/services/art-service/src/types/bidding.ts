import type { Auction } from '../domain/entities/Auction';
import type { UserPublicProfile } from './user';

export type BiddingHistoryAuction = Pick<
  Auction,
  | 'title'
  | 'description'
  | 'imageKey'
  | 'startTime'
  | 'endTime'
  | 'status'
  | 'startPrice'
  | 'currentBid'
  | 'winnerId'
> & {
  id?: string;
  _id?: string;
};

export type BiddingHistoryUser = UserPublicProfile & { _id?: string };

