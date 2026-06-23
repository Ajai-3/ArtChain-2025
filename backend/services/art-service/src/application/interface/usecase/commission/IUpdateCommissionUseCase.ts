import { CreateCommissionDto } from '../../dto/CreateCommissionDto';
import type { UpdateCommissionResponse } from '../../../../types/usecase-response';

export interface IUpdateCommissionUseCase {
  execute(id: string, userId: string, data: Partial<CreateCommissionDto>): Promise<UpdateCommissionResponse>;
}
