import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import { CreateCommissionDto } from "../../interface/dto/CreateCommissionDto";
import { ICreateCommissionUseCase } from "../../interface/usecase/commission/ICreateCommissionUseCase";
import { Commission, CommissionStatus } from "../../../domain/entities/Commission";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ICommissionRepository } from "../../../domain/repositories/ICommissionRepository";
import { IChatService } from "../../../domain/interfaces/IChatService";
import { UserService } from "../../../infrastructure/service/UserService";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { CommissionMapper } from "../../mapper/CommissionMapper";
import { IPlatformConfigRepository } from "../../../domain/repositories/IPlatformConfigRepository";

@injectable()
export class CreateCommissionUseCase implements ICreateCommissionUseCase {
  constructor(
    @inject(TYPES.ICommissionRepository)
    private readonly _commissionRepository: ICommissionRepository,
    @inject(TYPES.IChatService)
    private readonly _chatService: IChatService,
    @inject(TYPES.IPlatformConfigRepository)
    private readonly _platformConfigRepository: IPlatformConfigRepository
  ) {}

  async execute(dto: CreateCommissionDto): Promise<any> {
    const { requesterId, artistId, title, description, referenceImages, budget, deadline } = dto;

    if (!requesterId || !artistId) {
      throw new BadRequestError("Requester and Artist IDs are required");
    }

    if (requesterId === artistId) {
      throw new BadRequestError("Cannot request commission from yourself");
    }

    console.log(requesterId, artistId)
    console.log("Validating artist:", artistId);
    const artist = await UserService.getUserById(artistId);
    if (!artist) {
      console.error("Artist validation failed for ID:", artistId);
      throw new NotFoundError("Artist not found");
    }
    console.log(artist)
    
    if (artist.role !== "artist") {
      console.error("User is not an artist:", artistId);
      throw new BadRequestError("Artist role is not valid");
    }
    console.log("Artist validated:", artist.name || artist.username);

    // Check for existing active commissions for this pair
    const existingCommissions = await this._commissionRepository.findByRequesterId(requesterId);
    const activeCommissionForArtist = existingCommissions.find(c => 
        c.artistId === artistId && 
        ![CommissionStatus.COMPLETED, CommissionStatus.CANCELLED].includes(c.status as any)
    );

    if (activeCommissionForArtist) {
        throw new BadRequestError("You already have an active commission request with this artist. Please complete or cancel it before starting a new one.");
    }

    // 1. Create Conversation in Chat Service (Type: REQUEST)
    let conversationId: string;
    try {
        console.log("Creating conversation between", requesterId, "and", artistId);
        conversationId = await this._chatService.createRequestConversation(requesterId, artistId);
        console.log("Conversation created with ID:", conversationId);
    } catch (error) {
        console.error("Failed to create conversation:", error);
        throw new BadRequestError("Failed to initialize communication channel");
    }

    // 2. Create Commission Entity
    const extractKey = (url: string) => {
      if (!url) return "";
      try {
        if (url.includes(".cloudfront.net/")) {
          return url.split(".cloudfront.net/")[1];
        }
        return url;
      } catch (e) {
        return url;
      }
    };

    // Fetch Platform Config for current commission percentage
    const platformConfig = await this._platformConfigRepository.getConfig();
    const feePercentage = platformConfig?.commissionArtPercentage || 5;

    const commission: Commission = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      requesterId,
      artistId,
      conversationId,
      title,
      description,
      referenceImages: (referenceImages || []).map(extractKey),
      budget,
      deadline,
      status: CommissionStatus.REQUESTED,
      platformFeePercentage: feePercentage,
      history: [
          {
              action: CommissionStatus.REQUESTED,
              userId: requesterId,
              timestamp: new Date(),
              details: "Commission Requested"
          }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 3. Save to Repository
    const createdCommission = await this._commissionRepository.create(commission);

    return CommissionMapper.toDTO(createdCommission);
  }
}
