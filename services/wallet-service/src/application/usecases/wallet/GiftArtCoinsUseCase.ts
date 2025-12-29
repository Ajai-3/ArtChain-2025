import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IGiftArtCoinsUseCase } from "../../interface/usecase/wallet/IGiftArtCoinsUseCase";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { WalletProducer } from "../../../infrastructure/rabbitmq/producers/WalletProducer";
import { WALLET_MESSAGES } from "../../../constants/WalletMessages";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { v4 as uuidv4 } from 'uuid';
import { TransactionCategory } from "@prisma/client";

import { GiftArtCoinsDTO } from "../../interface/dto/wallet/GiftArtCoinsDTO";
import { WalletStatus } from "../../../domain/entities/Wallet";

@injectable()
export class GiftArtCoinsUseCase implements IGiftArtCoinsUseCase {
    private _walletProducer: WalletProducer;

    constructor(
        @inject(TYPES.IWalletRepository)
        private readonly _walletRepository: IWalletRepository
    ) {
        this._walletProducer = new WalletProducer();
    }

    async execute(data: GiftArtCoinsDTO): Promise<{ newBalance: number; lockedAmount: number; }> {
        const { senderId, receiverId, amount, message, senderName, senderImage } = data;

        const senderWallet = await this._walletRepository.getByUserId(senderId);
        if (!senderWallet) {
            throw new NotFoundError(WALLET_MESSAGES.NOT_FOUND_WALLET);
        }

        if (senderWallet.status === WalletStatus.LOCKED || senderWallet.status === WalletStatus.SUSPENDED) {
             throw new BadRequestError(WALLET_MESSAGES.LOCKED_OR_SUSPENDED);
        }

        if (senderWallet.status !== WalletStatus.ACTIVE) {
             throw new BadRequestError(WALLET_MESSAGES.NOT_ACTIVE);
        }

        if (senderWallet.balance < amount) {
            throw new BadRequestError(WALLET_MESSAGES.INSUFFICIENT_FUNDS);
        }

        const receiverWallet = await this._walletRepository.getByUserId(receiverId);
        if (receiverWallet && receiverWallet.status !== WalletStatus.ACTIVE) {
             throw new BadRequestError(WALLET_MESSAGES.RECEIVER_NOT_ACTIVE);
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
            senderImage: senderImage || ""
        });

        const updatedSenderWallet = await this._walletRepository.getByUserId(senderId);

        return {
            newBalance: updatedSenderWallet!.balance,
            lockedAmount: updatedSenderWallet!.lockedAmount,
        };
    }
}
