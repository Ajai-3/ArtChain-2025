import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ICommissionRepository } from "../../../domain/repositories/ICommissionRepository";
import { IGetCommissionByConversationUseCase } from "../../interface/usecase/commission/IGetCommissionByConversationUseCase";
import { CommissionMapper } from "../../mapper/CommissionMapper";
import { NotFoundError } from "art-chain-shared";
import { UserService } from "../../../infrastructure/service/UserService";

@injectable()
export class GetCommissionByConversationUseCase implements IGetCommissionByConversationUseCase {
  constructor(
    @inject(TYPES.ICommissionRepository)
    private readonly _commissionRepository: ICommissionRepository
  ) {}

  async execute(conversationId: string): Promise<any> {
    const commissions = await this._commissionRepository.findAllByConversationId(conversationId);
    
    if (!commissions || commissions.length === 0) {
      throw new NotFoundError("No commissions found for this conversation");
    }

    // Latest is at index 0 because of repository sort
    const latestCommission = commissions[0];
    const previousCommissions = commissions.slice(1);

    // Fetch user details for the latest one
    let requester = null;
    let artist = null;

    try {
        [requester, artist] = await Promise.all([
            UserService.getUserById(latestCommission.requesterId),
            UserService.getUserById(latestCommission.artistId)
        ]);
    } catch (error) {
        console.warn("Failed to fetch user details for commission:", error);
    }

    return {
        active: CommissionMapper.toDTO(latestCommission, requester, artist),
        history: previousCommissions.map(c => CommissionMapper.toDTO(c))
    };
  }
}
