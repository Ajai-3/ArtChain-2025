import { IndexedUser } from "../../../../types/IndexedUser";
import { SafeUser } from "../../../../domain/repositories/IBaseRepository";
import { indexUser } from "../../../../presentation/service/elasticUser.service";
import { logger } from "../../../../logger/logger";

export class AddUserToElasticSearchUseCase {
  async execute(user: SafeUser): Promise<void> {
    const elasticUser: IndexedUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || "",
      bannerImage: user.bannerImage || "",
      bio: user.bio || "",
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    };

    logger.debug(user);

    await indexUser(elasticUser);
  }
}
