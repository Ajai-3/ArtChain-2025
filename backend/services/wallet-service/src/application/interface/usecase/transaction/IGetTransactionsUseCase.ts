import { GetTransactionsDto } from './../../dto/transaction/GetTransactionsDto';
import { TransactionResponse } from '../../../../types/Transaction';

export interface IGetTransactionsUseCase {
    execute(data: GetTransactionsDto): Promise<TransactionResponse>;
}