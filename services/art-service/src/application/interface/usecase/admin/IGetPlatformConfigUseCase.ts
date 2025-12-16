import { PlatformConfig } from "../../../../domain/entities/PlatformConfig";
import { GetPlatformConfigDTO } from "../../dto/admin/GetPlatformConfigDTO";

export interface IGetPlatformConfigUseCase {
  execute(dto?: GetPlatformConfigDTO): Promise<PlatformConfig>;
}
