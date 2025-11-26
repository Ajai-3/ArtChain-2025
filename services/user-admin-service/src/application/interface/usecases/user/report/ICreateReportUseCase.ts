import { Report } from '../../../../../domain/entities/Report';
import { ReportRequestDto } from '../../../dtos/user/report/ReportRequestDto';

export interface ICreateReportUseCase {
  execute(dto: ReportRequestDto): Promise<Report>;
}
