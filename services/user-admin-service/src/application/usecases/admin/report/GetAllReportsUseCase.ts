import { injectable, inject } from 'inversify';
import { Report } from '../../../../domain/entities/Report';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { IReportRepository } from '../../../../domain/repositories/user/IReportRepository';
import { IGetAllReportsUseCase } from '../../../interface/usecases/admin/report/IGetAllReportsUseCase';

@injectable()
export class GetAllReportsUseCase implements IGetAllReportsUseCase {
  constructor(
    @inject(TYPES.IReportRepository) private readonly _reportRepository: IReportRepository
  ) {}

  async execute(page: number, limit: number, filters?: { status?: string; targetType?: string }): Promise<{ data: Report[]; meta: { total: number; page: number; limit: number } }> {
    return this._reportRepository.findAll(page, limit, filters);
  }
}
