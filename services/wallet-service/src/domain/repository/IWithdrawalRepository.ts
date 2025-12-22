import { WithdrawalRequest } from "../entities/WithdrawalRequest";
import { CreateWithdrawalRequestDTO } from "../../application/interface/dto/withdrawal/CreateWithdrawalRequestDTO";
import { IBaseRepository } from "./IBaseRepository";

export interface IWithdrawalRepository extends IBaseRepository<WithdrawalRequest> {
  getWithdrawalRequestById(id: string): Promise<WithdrawalRequest | null>;


  getWithdrawalRequestsByUserId(
    userId: string,
    page: number,
    limit: number,
    status?: string,
    method?: string
  ): Promise<{ requests: WithdrawalRequest[]; total: number }>;

  getWithdrawalRequestsByWalletId(walletId: string): Promise<WithdrawalRequest[]>;

  updateWithdrawalRequestStatus(
    id: string,
    status: string,
    transactionId?: string,
    rejectionReason?: string
  ): Promise<WithdrawalRequest>;

  findAll(page: number, limit: number, status?: string, method?: string): Promise<{ requests: WithdrawalRequest[]; total: number }>;

  updateStatus(
    id: string,
    status: string,
    rejectionReason?: string
  ): Promise<WithdrawalRequest>;

  getStatusCounts(): Promise<Record<string, number>>;
}
