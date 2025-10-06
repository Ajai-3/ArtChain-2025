import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { IGetUsersByIdsUserUseCase } from "../../../interface/usecases/user/user-intraction/IGetUsersByIdsUserUseCase";
import { ArtUser } from "../../../../types/ArtUser";


export class GetUsersByIdsUserUseCase implements IGetUsersByIdsUserUseCase {
  constructor(private readonly _userRepo: IUserRepository) {}

  async execute(ids: string[]): Promise<ArtUser[]> {
    return this._userRepo.findManyByIdsBatch(ids);
  }
}
