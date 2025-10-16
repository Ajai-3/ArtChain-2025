import { IndexedUser } from '../../../../../types/IndexedUser';
import { SafeUser } from '../../../../../domain/repositories/IBaseRepository';

export interface IAddUserToElasticSearchUseCase {
execute(user: SafeUser): Promise<IndexedUser>
}