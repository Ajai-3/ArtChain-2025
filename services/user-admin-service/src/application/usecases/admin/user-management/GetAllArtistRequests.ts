import { GetAllUsersQueryDTO } from "../../../../domain/dtos/admin/GetAllUsersQueryDTO";
import { IArtistRequestRepository } from "../../../../domain/repositories/user/IArtistRequestRepository";
import { IGetAllArtistRequestsUseCase } from "../../../../domain/usecases/admin/user-management/IGetAllArtistRequestsUseCase";

export class GetAllArtistRequestsUseCase
  implements IGetAllArtistRequestsUseCase
{
  constructor(private readonly _artistRepo: IArtistRequestRepository) {}
  execute(query: GetAllUsersQueryDTO): Promise<any> {
    const { page = 1, limit = 8 } = query;
    return this._artistRepo.getArtistRequests(page, limit);
  }
}
