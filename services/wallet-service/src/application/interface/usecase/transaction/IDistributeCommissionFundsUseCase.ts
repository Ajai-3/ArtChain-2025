export interface IDistributeCommissionFundsUseCase {
  execute(params: {
    userId: string;
    artistId: string;
    commissionId: string;
    totalAmount: number;
    artistAmount: number;
    platformFee: number;
  }): Promise<boolean>;
}
