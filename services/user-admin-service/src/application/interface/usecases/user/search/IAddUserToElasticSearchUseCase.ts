import { IndexedUser } from '../../../../../types/IndexedUser';
import { SafeUser } from '../../../../../domain/entities/User';

export interface IAddUserToElasticSearchUseCase {
execute(user: SafeUser): Promise<IndexedUser>
}