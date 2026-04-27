import { AllReportsResponse } from '../../../../../types/responses/admin/AllReportsResponse';

export interface IGetAllReportsUseCase {
  execute(page: number, limit: number, filters?: { status?: string; targetType?: string }): Promise<AllReportsResponse>;
}
