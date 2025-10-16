import { GetTransactionsDto } from './../../dto/transaction/GetTransactionsDto';

export interface IGetTransactionsUseCase {
    execute(data: GetTransactionsDto): Promise<any>;
}