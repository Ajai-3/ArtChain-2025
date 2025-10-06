import { GetAllUsersQueryDTO } from "../../../interface/dtos/admin/GetAllUsersQueryDTO";
import { IArtistRequestRepository } from "../../../../domain/repositories/user/IArtistRequestRepository";
import { IGetAllArtistRequestsUseCase } from "../../../interface/usecases/admin/user-management/IGetAllArtistRequestsUseCase";

export class GetAllArtistRequestsUseCase
  implements IGetAllArtistRequestsUseCase
{
  constructor(private readonly _artistRepo: IArtistRequestRepository) {}
  execute(query: GetAllUsersQueryDTO): Promise<any> {
    const { page = 1, limit = 8 } = query;
    return this._artistRepo.getArtistRequests(page, limit);
  }
}
