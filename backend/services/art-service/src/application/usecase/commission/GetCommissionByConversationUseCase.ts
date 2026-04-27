import { inject, injectable } from 'inversify';
import { NotFoundError } from 'art-chain-shared';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { CommissionMapper } from '../../mapper/CommissionMapper';
import { UserService } from '../../../infrastructure/service/UserService';
import { COMMISSION_MESSAGES } from '../../../constants/CommissionMessage';
import { GetCommissionByConversationResponse } from '../../../types/usecase-response';
import { ICommissionRepository } from '../../../domain/repositories/ICommissionRepository';
import { IGetCommissionByConversationUseCase } from '../../interface/usecase/commission/IGetCommissionByConversationUseCase';

@injectable()
export class GetCommissionByConversationUseCase implements IGetCommissionByConversationUseCase {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: UserService,
    @inject(TYPES.ICommissionRepository)
    private readonly _commissionRepository: ICommissionRepository
  ) {}

  async execute(conversationId: string): Promise<GetCommissionByConversationResponse> {
    const commissions = await this._commissionRepository.findAllByConversationId(conversationId);
    
    if (!commissions || commissions.length === 0) {
      throw new NotFoundError(COMMISSION_MESSAGES.COMMISSION_NOT_FOUND);
    }

    // Latest is at index 0 because of repository sort
    const latestCommission = commissions[0];
    const previousCommissions = commissions.slice(1);

    // Fetch user details for the latest one
    let requester = null;
    let artist = null;

    try {
        [requester, artist] = await Promise.all([
            this._userService.getUserById(latestCommission.requesterId),
            this._userService.getUserById(latestCommission.artistId)
        ]);
    } catch (error) {
        console.warn('Failed to fetch user details for commission:', error);
    }

    return {
        active: CommissionMapper.toDTO(latestCommission, requester, artist),
        history: previousCommissions.map(c => CommissionMapper.toDTO(c))
    };
  }
}
