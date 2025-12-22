import { PlatformConfig } from "../../../../domain/entities/PlatformConfig";
import { UpdatePlatformConfigDTO } from "../../dto/admin/UpdatePlatformConfigDTO";

export interface IUpdatePlatformConfigUseCase {
  execute(dto: UpdatePlatformConfigDTO): Promise<PlatformConfig>;
}
