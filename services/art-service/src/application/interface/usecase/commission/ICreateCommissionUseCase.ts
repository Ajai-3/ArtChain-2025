import { CreateCommissionDto } from "../../dto/CreateCommissionDto";

export interface ICreateCommissionUseCase {
  execute(dto: CreateCommissionDto): Promise<any>;
}
