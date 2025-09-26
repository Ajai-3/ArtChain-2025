import { WalletRepositoryImpl } from "../repositories/WalletRepositoryImpl";
import { TransactionRepositoryImpl } from "../repositories/TransactionRepositoryImpl";
import { TransactionController } from "../../presentation/controllers/TransactionController";
import { GetTransactionsUseCase } from './../../application/usecases/transaction/GetTransactionsUseCase';

// Repositories
const walletRepo = new WalletRepositoryImpl()
const transactionRepo = new TransactionRepositoryImpl()

// Use cases
const getTransactionsUseCase = new GetTransactionsUseCase(walletRepo, transactionRepo)

// Controller
export const transactionController = new TransactionController(getTransactionsUseCase)