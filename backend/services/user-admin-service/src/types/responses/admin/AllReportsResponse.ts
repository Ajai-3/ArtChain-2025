import { Report } from '../../../domain/entities/Report';
import { PaginationMeta } from './GroupedReportsResponse';

export interface AllReportsResponse {
  data: Report[];
  meta: PaginationMeta;
}