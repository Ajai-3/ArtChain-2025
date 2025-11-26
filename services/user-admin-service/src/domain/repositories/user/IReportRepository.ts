import { Report } from '../../entities/Report';
import { IBaseRepository } from '../IBaseRepository';

export interface IReportRepository extends IBaseRepository<Report> {
  findByReporterId(reporterId: string): Promise<Report[]>;
}
