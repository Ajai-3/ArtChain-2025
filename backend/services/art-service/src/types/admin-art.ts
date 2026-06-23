import type { AdminArtListItem } from './admin';

export type AdminArtsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminArtsResponse = { data: AdminArtListItem[]; meta: AdminArtsMeta };

