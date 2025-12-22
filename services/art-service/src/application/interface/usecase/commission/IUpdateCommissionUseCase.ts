import { CreateCommissionDto } from "../../dto/CreateCommissionDto";

export interface IUpdateCommissionUseCase {
  execute(id: string, userId: string, data: Partial<CreateCommissionDto>): Promise<any>;
}
