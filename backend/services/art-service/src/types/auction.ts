import type { AuctionMapper } from '../application/mapper/AuctionMapper';

export type AuctionDTO = ReturnType<typeof AuctionMapper.toDTO>;

