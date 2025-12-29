import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IGiftArtCoinsUseCase } from "../../interface/usecase/wallet/IGiftArtCoinsUseCase";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { WalletProducer } from "../../../infrastructure/rabbitmq/producers/WalletProducer";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { v4 as uuidv4 } from 'uuid';
import { TransactionCategory } from "@prisma/client";

@injectable()
export class GiftArtCoinsUseCase implements IGiftArtCoinsUseCase {
    private _walletProducer: WalletProducer;

    constructor(
        @inject(TYPES.IWalletRepository)
        private readonly _walletRepository: IWalletRepository
    ) {
        this._walletProducer = new WalletProducer();
    }

    async execute(data: {
        senderId: string;
        receiverId: string;
        amount: number;
        message?: string;
        senderName?: string;
        senderImage?: string;
    }): Promise<{ newBalance: number; lockedAmount: number; }> {
        const { senderId, receiverId, amount, message, senderName, senderImage } = data;

        const senderWallet = await this._walletRepository.getByUserId(senderId);
        if (!senderWallet) {
            // be - messages must be constants
            throw new NotFoundError("Sender wallet not found.");
        }

        if (senderWallet.status === "locked" || senderWallet.status === "suspended") {
            // be - messages must be constants
             throw new BadRequestError("Your wallet is locked or suspended.");
        }

        if (senderWallet.status !== "active") {
            // be - messages must be constants
             throw new BadRequestError("Your wallet is not active.");
        }

        if (senderWallet.balance < amount) {
            // be - messages must be constants
            throw new BadRequestError("Insufficient Art Coins.");
        }

        const receiverWallet = await this._walletRepository.getByUserId(receiverId);
        if (receiverWallet && receiverWallet.status !== "active") {
            // be - messages must be constants
             throw new BadRequestError("Receiver wallet is not active.");
        }

        const referenceId = uuidv4();
        const description = message ? `Gift: ${message}` : "Gifted Art Coins";

        const success = await this._walletRepository.transferFunds(
            senderId,
            receiverId,
            amount,
            description,
            referenceId,
            TransactionCategory.GIFT
        );

        if (!success) {
            throw new Error("Failed to process gift transaction.");
        }

        // Publish Event
        await this._walletProducer.publishGiftEvent({
            senderId,
            receiverId,
            amount,
            message,
            timestamp: new Date(),
            senderName,
            senderImage
        });

        const updatedSenderWallet = await this._walletRepository.getByUserId(senderId);

        return {
            newBalance: updatedSenderWallet!.balance,
            lockedAmount: updatedSenderWallet!.lockedAmount,
        };
    }
}
