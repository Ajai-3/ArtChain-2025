import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IGetAllWithdrawalRequestsUseCase } from "../../interface/usecases/withdrawal/IGetAllWithdrawalRequestsUseCase";
import { IWithdrawalRepository } from "../../../domain/repository/IWithdrawalRepository";
import { WithdrawalRequest } from "../../../domain/entities/WithdrawalRequest";
import { UserServiceClient } from "../../../infrastructure/clients/UserServiceClient";

@injectable()
export class GetAllWithdrawalRequestsUseCase implements IGetAllWithdrawalRequestsUseCase {
  constructor(
    @inject(TYPES.IWithdrawalRepository)
    private readonly _withdrawalRepository: IWithdrawalRepository,
    @inject(TYPES.UserServiceClient)
    private readonly _userServiceClient: UserServiceClient
  ) {}

  async execute(page: number = 1, limit: number = 10, token?: string, status?: string): Promise<any> {
    const { requests: withdrawals, total } = await this._withdrawalRepository.findAll(page, limit, status);

    // Get status counts for all withdrawals
    const statusCounts = await this._withdrawalRepository.getStatusCounts();

    // Get unique user IDs
    const userIds = [...new Set(withdrawals.map(w => w.userId))];

    // Fetch user information with token
    let users: any[] = [];
    if (userIds.length > 0) {
        users = await this._userServiceClient.getUsersByIds(userIds, token);
    }

    // Create a map for quick lookup
    const userMap = new Map(users.map(user => [user.id, user]));

    // Merge withdrawal data with user information
    const withdrawalsWithUserInfo = withdrawals.map(withdrawal => {
      const user = userMap.get(withdrawal.userId);
      return {
        ...withdrawal,
        user: user ? {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
        } : null,
      };
    });

    return {
        withdrawalRequests: withdrawalsWithUserInfo,
        total,
        totalCount: total,
        statusCounts,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
  }
}
