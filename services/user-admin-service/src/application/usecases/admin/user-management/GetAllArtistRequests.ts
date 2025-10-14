import { inject, injectable } from "inversify";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { GetAllUsersQueryDto } from "../../../interface/dtos/admin/GetAllUsersQueryDto";
import { IArtistRequestRepository } from "../../../../domain/repositories/user/IArtistRequestRepository";
import { IGetAllArtistRequestsUseCase } from "../../../interface/usecases/admin/user-management/IGetAllArtistRequestsUseCase";

@injectable()
export class GetAllArtistRequestsUseCase
  implements IGetAllArtistRequestsUseCase
{
  constructor(
    @inject(TYPES.IArtistRequestRepository)
    private readonly _artistRepo: IArtistRequestRepository
  ) {}
  execute(query: GetAllUsersQueryDto): Promise<any> {
    const { page = 1, limit = 8 } = query;
    return this._artistRepo.getArtistRequests(page, limit);
  }
}
