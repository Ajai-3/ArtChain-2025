  import { inject, injectable } from "inversify";
  import { ArtUser } from "../../../../types/ArtUser";
  import { mapCdnUrl } from "../../../../utils/mapCdnUrl";
  import { TYPES } from "../../../../infrastructure/inversify/types";
  import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
  import { IGetUsersByIdsUserUseCase } from "../../../interface/usecases/user/user-intraction/IGetUsersByIdsUserUseCase";
  import { ISupporterRepository } from "../../../../domain/repositories/user/ISupporterRepository";

  @injectable()
  export class GetUsersByIdsUserUseCase implements IGetUsersByIdsUserUseCase {
    constructor(
      @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository,
      @inject(TYPES.ISupporterRepository)
      private readonly _supporterRepo: ISupporterRepository
    ) {}

    async execute(ids: string[], currentUserId?: string): Promise<ArtUser[]> {
      const users = await this._userRepo.findManyByIdsBatch(ids);

      let supportingMap: Record<string, boolean> = {};
      if (currentUserId) {
        const supportingIds = await this._supporterRepo.getSupportingIds(
          currentUserId
        );
        supportingMap = supportingIds.reduce((acc, id) => {
          acc[id] = true;
          return acc;
        }, {} as Record<string, boolean>);
      }

      return users.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        plan: user.plan,
        role: user.role,
        status: user.status,
        profileImage: mapCdnUrl(user.profileImage) ?? null,
        ...(currentUserId && { isSupporting: supportingMap[user.id] ?? false }),
      }));
    }
  }
