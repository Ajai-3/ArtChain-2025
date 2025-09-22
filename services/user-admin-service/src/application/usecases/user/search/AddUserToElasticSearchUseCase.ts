import { IndexedUser } from '../../../../types/IndexedUser';
import { SafeUser } from '../../../../domain/repositories/IBaseRepository';
import { logger } from '../../../../utils/logger';

export class AddUserToElasticSearchUseCase {
  async execute(user: SafeUser): Promise<IndexedUser> {
    const elasticUser: IndexedUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || '',
      bannerImage: user.bannerImage || '',
      bio: user.bio || '',
      role: user.role,
      plan: user.plan,
      status: user.status,
      createdAt: user.createdAt,
    };

    logger.debug(user);

    return elasticUser;
  }
}
