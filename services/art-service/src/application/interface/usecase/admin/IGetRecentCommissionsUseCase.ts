import { Commission } from "../../../../domain/entities/Commission";

export interface IGetRecentCommissionsUseCase {
  execute(limit: number): Promise<Commission[]>;
}
