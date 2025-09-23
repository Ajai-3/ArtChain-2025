import { WalletRepositoryImpl } from "../repositories/WalletRepositoryImpl";
import { WalletController } from "../../presentation/controllers/WalletController";
import { GetWalletUseCase } from "../../application/usecases/wallet/GetWalletUseCase";

// Repositories
const walletRepo = new WalletRepositoryImpl()

// Use case
const getWalletUseCase = new GetWalletUseCase(walletRepo)

// Controller
export const walletController = new WalletController(getWalletUseCase)