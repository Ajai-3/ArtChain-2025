import { CreateCommissionDto } from '../../dto/CreateCommissionDto';
import type { CreateCommissionResponse } from '../../../../types/usecase-response';

export interface ICreateCommissionUseCase {
  execute(dto: CreateCommissionDto): Promise<CreateCommissionResponse>;
}
